import { BadRequestException, Injectable, NotFoundException, PreconditionFailedException } from '@nestjs/common';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { ClubEntity } from './entities/club.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { SocioEntity } from '../socio/entities/socio.entity';

@Injectable()
export class ClubService {
  constructor(
    @InjectRepository(ClubEntity)
    private readonly clubRepository: Repository<ClubEntity>,

    @InjectRepository(SocioEntity)
    private readonly socioRepository: Repository<SocioEntity>,
  ) {}

  async create(createClubDto: CreateClubDto): Promise<ClubEntity> {
    const club = this.clubRepository.create(createClubDto);
    return this.clubRepository.save(club);
  }

  async findAll(): Promise<ClubEntity[]> {
    return this.clubRepository.find();
  }

  async findOne(id: string): Promise<ClubEntity> {
    const club = await this.clubRepository.findOne({ where: { id } });
    if (!club) {
      throw new NotFoundException('Club no encontrado');
    }
    return club;
  }

  async update(id: string, updateClubDto: UpdateClubDto): Promise<ClubEntity> {
    const club = await this.findOne(id); 
    await this.clubRepository.update(id, updateClubDto);
    return this.findOne(id); 
  }

  async remove(id: string): Promise<void> {
    const club = await this.findOne(id);
    await this.clubRepository.remove(club);
  }

  async addMemberToClub(clubId: string, socioId: string): Promise<ClubEntity> {
    const club = await this.clubRepository.findOne({ where: { id: clubId }, relations: ['socios'] });
    if (!club) {
      throw new NotFoundException('Club no encontrado');
    }
  
    const socio = await this.socioRepository.findOne({ where: { id: socioId } });
    if (!socio) {
      throw new NotFoundException('Socio no encontrado');
    }
    
    if (!Array.isArray(club.socios)) {
      club.socios = [];
    }
  
    if (!club.socios.some(s => s.id === socio.id)) {
      club.socios.push(socio);
      return await this.clubRepository.save(club);
    }
  
    return club;
  }
  

  async findMembersFromClub(clubId: string): Promise<SocioEntity[]> {
    const club = await this.clubRepository.findOne({
      where: { id: clubId },
      relations: ['socios']
    });
    if (!club) {
      throw new NotFoundException('Club no encontrado');
    }

    return club.socios;
  }

  async findMemberFromClub(clubId: string, socioId: string): Promise<SocioEntity> {
    const club = await this.clubRepository.findOne({
      where: { id: clubId },
      relations: ['socios']
    });
    if (!club) {
      throw new NotFoundException('Club no encontrado');
    }

    const socio = club.socios.find(s => s.id === socioId);
    if (!socio) {
      throw new NotFoundException('Socio no encontrado en el club');
    }

    return socio;
  }

  async updateMembersFromClub(clubId: string, memberIds: string[]): Promise<ClubEntity> {
    if (!Array.isArray(memberIds) || memberIds.length === 0) {
      throw new BadRequestException('Debe proporcionar una lista de IDs de socios');
    }
    const club = await this.clubRepository.findOne({
      where: { id: clubId },
      relations: ['socios'],
    });
    if (!club) {
      throw new NotFoundException('Club no encontrado');
    }
    const socios = await this.socioRepository.findBy({
      id: In(memberIds),
    });
  
    if (socios.length !== memberIds.length) {
      throw new NotFoundException('Uno o más socios no encontrados');
    }
    club.socios = socios;
  
    await this.clubRepository.save(club);
  
    return club;
  }

  async deleteMemberFromClub(clubId: string, socioId: string): Promise<ClubEntity> {
    const club = await this.clubRepository.findOne({ where: { id: clubId }, relations: ['socios'],});

    if (!club) {
      throw new NotFoundException('Club no encontrado');
    }
    const socio = await this.socioRepository.findOne({ where: { id: socioId } });

    if (!socio) {
      throw new NotFoundException('Socio no encontrado');
    }

    const socioIndex = club.socios.findIndex(s => s.id === socio.id);
    if (socioIndex === -1) {
      throw new PreconditionFailedException('El socio no está asociado al club');
    }
    club.socios.splice(socioIndex, 1);

    await this.clubRepository.save(club);

    return club;
  }
}
