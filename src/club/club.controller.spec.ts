import { Test, TestingModule } from '@nestjs/testing';
import { ClubController } from './club.controller';
import { ClubService } from './club.service';
import { ClubEntity } from './entities/club.entity';
import { SocioEntity } from '../socio/entities/socio.entity';
import { NotFoundException, PreconditionFailedException } from '@nestjs/common';

describe('ClubController', () => {
  let controller: ClubController;
  let service: ClubService;

  const clubMock: ClubEntity = {
    id: '1',
    nombre: 'Club de prueba',
    fechaDeFundacion: new Date('2020-01-01'),
    imagen: 'imagen.png',
    descripcion: 'Descripción del club',
    socios: [],
  };

  const socioMock: SocioEntity = {
    id: '1',
    nombre: 'Socio de prueba',
    email: 'socio@example.com',
    fechaDeNacimiento: new Date('1990-01-01'),
    clubs: [],
  };

  beforeEach(async () => {
    const serviceMock = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      addMemberToClub: jest.fn(),
      findMemberFromClub: jest.fn(), 
      findMembersFromClub: jest.fn(),
      updateMembersFromClub: jest.fn(),
      deleteMemberFromClub: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClubController],
      providers: [
        {
          provide: ClubService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<ClubController>(ClubController);
    service = module.get<ClubService>(ClubService);
  });

  describe('create', () => {
    it('Crear un club y devolverlo', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(clubMock);

      const result = await controller.create({
        nombre: 'Club de prueba',
        fechaDeFundacion: new Date('2020-01-01'),
        imagen: 'imagen.png',
        descripcion: 'Descripción del club',
      });

      expect(result).toEqual(clubMock);
      expect(service.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('Obtener todos los clubs', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([clubMock]);

      const result = await controller.findAll();
      expect(result).toEqual([clubMock]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('Obtener un club por id', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(clubMock);

      const result = await controller.findOne('1');
      expect(result).toEqual(clubMock);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });

    it('Error al obtener un club que no existe', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(controller.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });
  

  describe('update', () => {
    it('Actualizar un club y devolverlo', async () => {
      jest.spyOn(service, 'update').mockResolvedValue(clubMock);

      const result = await controller.update('1', { nombre: 'Nuevo Club' });
      expect(result).toEqual(clubMock);
      expect(service.update).toHaveBeenCalledWith('1', { nombre: 'Nuevo Club' });
    });

    it('Error al actualizar un club que no existe', async () => {
      jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException());

      await expect(controller.update('1', { nombre: 'Nuevo Club' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('Eliminar un club', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await controller.remove('1');
      expect(service.remove).toHaveBeenCalledWith('1');
    });

    it('Error al eliminar un club que no existe', async () => {
      jest.spyOn(service, 'remove').mockRejectedValue(new NotFoundException());

      await expect(controller.remove('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('addMemberToClub', () => {
    it('Agregar un socio a un club', async () => {
      jest.spyOn(service, 'addMemberToClub').mockResolvedValue({ ...clubMock, socios: [socioMock] });

      const result = await controller.addMemberToClub('1', '1');
      expect(result.socios).toContain(socioMock);
      expect(service.addMemberToClub).toHaveBeenCalledWith('1', '1');
    });

    it('Error al agregar un club que no existe', async () => {
      jest.spyOn(service, 'addMemberToClub').mockRejectedValue(new NotFoundException());

      await expect(controller.addMemberToClub('1', '1')).rejects.toThrow(NotFoundException);
    });

    it('Error al agregar un socio que no existe', async () => {
      jest.spyOn(service, 'addMemberToClub').mockRejectedValue(new NotFoundException());

      await expect(controller.addMemberToClub('1', '1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findMemberFromClub', () => {
    it('Encontrar un socio en un club', async () => {
      jest.spyOn(service, 'findMemberFromClub').mockResolvedValue(socioMock);

      const result = await controller.findMemberFromClub('1', '1');
      expect(result).toEqual(socioMock);
      expect(service.findMemberFromClub).toHaveBeenCalledWith('1', '1');
    });

    it('Error si el socio no está en el club', async () => {
      jest.spyOn(service, 'findMemberFromClub').mockRejectedValue(new PreconditionFailedException());

      await expect(controller.findMemberFromClub('1', '1')).rejects.toThrow(PreconditionFailedException);
    });
  });
});
