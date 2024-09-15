import { Test, TestingModule } from '@nestjs/testing';
import { SocioService } from './socio.service';
import { SocioEntity } from './entities/socio.entity';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('SocioService', () => {
  let service: SocioService;
  let repository: Repository<SocioEntity>;

  beforeEach(async () => {
    const repositoryMock = {
      findOne: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      find: jest.fn(),
      create: jest.fn(), 
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SocioService,
        {
          provide: getRepositoryToken(SocioEntity),
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<SocioService>(SocioService);
    repository = module.get<Repository<SocioEntity>>(getRepositoryToken(SocioEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('Creación de un socio', async () => {
      const createSocioDto = {
        nombre: 'John Doe',
        email: 'john.doe@example.com',
        fechaDeNacimiento: '1991-01-01', 
      };

      const createdSocio = {
        id: '1',
        ...createSocioDto,
        fechaDeNacimiento: new Date(createSocioDto.fechaDeNacimiento), 
        clubs: [],
      };

      jest.spyOn(repository, 'create').mockReturnValue(createdSocio as SocioEntity);
      jest.spyOn(repository, 'save').mockResolvedValue(createdSocio as SocioEntity);

      const result = await service.create(createSocioDto);
      expect(result).toEqual(createdSocio);
      expect(repository.create).toHaveBeenCalledWith(createSocioDto);
      expect(repository.save).toHaveBeenCalledWith(createdSocio);
    });

    it('Creación de un socio con un email invalido', async () => {
      const createSocioDto = {
        nombre: 'John Doe',
        email: 'invalid-email',
        fechaDeNacimiento: '1991-01-01', 
      };

      await expect(service.create(createSocioDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('Obtener todos los socios', async () => {
      const socios = [];
      jest.spyOn(repository, 'find').mockResolvedValue(socios);

      const result = await service.findAll();
      expect(result).toEqual(socios);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('obtener todos los socios por id', async () => {
      const socio = {
        id: '1',
        nombre: 'John Doe',
        email: 'john.doe@example.com',
        fechaDeNacimiento: new Date('1990-01-01'),
        clubs: [],
      };
      jest.spyOn(repository, 'findOne').mockResolvedValue(socio);

      const result = await service.findOne('1');
      expect(result).toEqual(socio);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('Obtener un socio con un id que no existe', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('Actualizar los datos de un socio', async () => {
      const updateSocioDto = {
        nombre: 'John Doe Updated',
        email: 'john.doe.updated@example.com',
        fechaDeNacimiento: new Date('1991-01-01'),
      };

      const updatedSocio = {
        id: '1',
        ...updateSocioDto,
        clubs: [],
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(updatedSocio);
      jest.spyOn(repository, 'update').mockResolvedValue(undefined);

      const result = await service.update('1', updateSocioDto);
      expect(result).toEqual(updatedSocio);
      expect(repository.update).toHaveBeenCalledWith('1', updateSocioDto);
    });

    it('Actualizar los datos con un email invalido', async () => {
      const updateSocioDto = {
        nombre: 'John Doe Updated',
        email: 'invalid-email',
        fechaDeNacimiento: new Date('1991-01-01'),
      };

      await expect(service.update('1', updateSocioDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('Eliminar un socio', async () => {
      const socio = {
        id: '1',
        nombre: 'John Doe',
        email: 'john.doe@example.com',
        fechaDeNacimiento: new Date('1990-01-01'),
        clubs: [],
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(socio);
      jest.spyOn(repository, 'remove').mockResolvedValue(undefined);

      await service.remove('1');
      expect(repository.remove).toHaveBeenCalledWith(socio);
    });
  });
});
