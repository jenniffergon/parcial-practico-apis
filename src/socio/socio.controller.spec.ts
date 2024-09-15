import { Test, TestingModule } from '@nestjs/testing';
import { SocioController } from './socio.controller';
import { SocioService } from './socio.service';
import { CreateSocioDto } from './dto/create-socio.dto';
import { UpdateSocioDto } from './dto/update-socio.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { SocioEntity } from './entities/socio.entity';

describe('SocioController', () => {
  let controller: SocioController;
  let service: SocioService;

  const socioMock: SocioEntity = {
    id: '1',
    nombre: 'John Doe',
    email: 'john.doe@example.com',
    fechaDeNacimiento: new Date('1991-01-01'),
    clubs: [],
  };

  const serviceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SocioController],
      providers: [
        {
          provide: SocioService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<SocioController>(SocioController);
    service = module.get<SocioService>(SocioService);
  });

  describe('create', () => {
    const createSocioDto: CreateSocioDto = {
      nombre: 'John Doe',
      email: 'john.doe@example.com',
      fechaDeNacimiento: '1991-01-01',
    };

    it('Crear un socio', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(socioMock);

      const result = await controller.create(createSocioDto);
      expect(result).toEqual(socioMock);
      expect(service.create).toHaveBeenCalledWith(createSocioDto);
    });

    it('Crear socio con email invalido', async () => {
      const invalidDto = { ...createSocioDto, email: 'invalid-email' };
      jest.spyOn(service, 'create').mockRejectedValue(new BadRequestException());

      await expect(controller.create(invalidDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('Obtener todos los socios', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([socioMock]);

      const result = await controller.findAll();
      expect(result).toEqual([socioMock]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('obtener un socio por id', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(socioMock);

      const result = await controller.findOne('1');
      expect(result).toEqual(socioMock);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });

    it('Obtener un socio con un id que no existe', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(controller.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateSocioDto: UpdateSocioDto = {
      nombre: 'John Doe Updated',
      email: 'john.doe.updated@example.com',
      fechaDeNacimiento: new Date('1991-01-01'),
    };

    it('Actualizar los datos de un socio', async () => {
      jest.spyOn(service, 'update').mockResolvedValue({ ...socioMock, ...updateSocioDto });

      const result = await controller.update('1', updateSocioDto);
      expect(result).toEqual({ ...socioMock, ...updateSocioDto });
      expect(service.update).toHaveBeenCalledWith('1', updateSocioDto);
    });
  });

  describe('remove', () => {
    it('Eliminar un socio', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await controller.remove('1');
      expect(service.remove).toHaveBeenCalledWith('1');
    });
  });
});
