import { Test, TestingModule } from '@nestjs/testing';
import { ClubService } from './club.service';
import { ClubEntity } from './entities/club.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SocioEntity } from '../socio/entities/socio.entity';
import { NotFoundException, PreconditionFailedException } from '@nestjs/common';

describe('ClubService', () => {
  let service: ClubService;
  let clubRepository: Repository<ClubEntity>;
  let socioRepository: Repository<SocioEntity>;

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
        ClubService,
        {
          provide: getRepositoryToken(ClubEntity),
          useValue: repositoryMock,
        },
        {
          provide: getRepositoryToken(SocioEntity),
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<ClubService>(ClubService);
    clubRepository = module.get<Repository<ClubEntity>>(getRepositoryToken(ClubEntity));
    socioRepository = module.get<Repository<SocioEntity>>(getRepositoryToken(SocioEntity));
  });

  describe('create', () => {
    it('Crear un club', async () => {
      jest.spyOn(clubRepository, 'create').mockReturnValue(clubMock);
      jest.spyOn(clubRepository, 'save').mockResolvedValue(clubMock);

      const result = await service.create({
        nombre: 'Club de prueba',
        fechaDeFundacion: new Date('2020-01-01'),
        imagen: 'imagen.png',
        descripcion: 'Descripción del club',
      });

      expect(result).toEqual(clubMock);
      expect(clubRepository.create).toHaveBeenCalled();
      expect(clubRepository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('Obtener todos los clubs', async () => {
      jest.spyOn(clubRepository, 'find').mockResolvedValue([clubMock]);

      const result = await service.findAll();
      expect(result).toEqual([clubMock]);
      expect(clubRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('Obtener un club por id', async () => {
      jest.spyOn(clubRepository, 'findOne').mockResolvedValue(clubMock);

      const result = await service.findOne('1');
      expect(result).toEqual(clubMock);
      expect(clubRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('Obtener un club que no existe', async () => {
      jest.spyOn(clubRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('Debe actualizar un club', async () => {
      jest.spyOn(clubRepository, 'findOne').mockResolvedValue(clubMock);
      jest.spyOn(clubRepository, 'update').mockResolvedValue(undefined);
      jest.spyOn(clubRepository, 'save').mockResolvedValue(clubMock);

      const result = await service.update('1', { nombre: 'Nuevo Club' });
      expect(result).toEqual(clubMock);
      expect(clubRepository.update).toHaveBeenCalledWith('1', { nombre: 'Nuevo Club' });
    });

    it('Error al actualizar un club que no existe', async () => {
      jest.spyOn(clubRepository, 'findOne').mockResolvedValue(null);

      await expect(service.update('1', { nombre: 'Nuevo Club' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('Eliminar un club', async () => {
      jest.spyOn(clubRepository, 'findOne').mockResolvedValue(clubMock);
      jest.spyOn(clubRepository, 'remove').mockResolvedValue(undefined);

      await service.remove('1');
      expect(clubRepository.remove).toHaveBeenCalledWith(clubMock);
    });

    it('Error si el club no existe al eliminar', async () => {
      jest.spyOn(clubRepository, 'findOne').mockResolvedValue(null);

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('addMemberToClub', () => {
    it('Agregar un socio a un club', async () => {
      jest.spyOn(clubRepository, 'findOne').mockResolvedValue({ ...clubMock, socios: [] });
      jest.spyOn(socioRepository, 'findOne').mockResolvedValue(socioMock);
      jest.spyOn(clubRepository, 'save').mockResolvedValue({ ...clubMock, socios: [socioMock] });
  
      const result = await service.addMemberToClub('1', '1');
      expect(result.socios).toContainEqual(socioMock);
      expect(clubRepository.save).toHaveBeenCalled();
    });
  
    it('Error al agregar un club que no existe', async () => {
      jest.spyOn(clubRepository, 'findOne').mockResolvedValue(null);
  
      await expect(service.addMemberToClub('1', '1')).rejects.toThrow(NotFoundException);
    });
  
    it('Error al agregar un socio que no existe', async () => {
      jest.spyOn(clubRepository, 'findOne').mockResolvedValue(clubMock);
      jest.spyOn(socioRepository, 'findOne').mockResolvedValue(null);
  
      await expect(service.addMemberToClub('1', '1')).rejects.toThrow(NotFoundException);
    });
  });
  

  describe('deleteMemberFromClub', () => {
    it('Eliminar un socio de un club', async () => {
      const clubWithMember = { ...clubMock, socios: [socioMock] };
      jest.spyOn(clubRepository, 'findOne').mockResolvedValue(clubWithMember);
      jest.spyOn(clubRepository, 'save').mockResolvedValue({ ...clubMock, socios: [] });

      const result = await service.deleteMemberFromClub('1', '1');
      expect(result.socios).not.toContain(socioMock);
      expect(clubRepository.save).toHaveBeenCalled();
    });

    it('Error al eliminar un club que no existe', async () => {
      jest.spyOn(clubRepository, 'findOne').mockResolvedValue(null);

      await expect(service.deleteMemberFromClub('1', '1')).rejects.toThrow(NotFoundException);
    });

    it('Error al eliminar un socio que no existe en el club', async () => {
      jest.spyOn(clubRepository, 'findOne').mockResolvedValue({ ...clubMock, socios: [] });

      await expect(service.deleteMemberFromClub('1', '1')).rejects.toThrow(PreconditionFailedException);
    });
  });  
  
});
