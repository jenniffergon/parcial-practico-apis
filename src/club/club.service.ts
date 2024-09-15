import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { ClubEntity } from './entities/club.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ClubService {
  constructor(
    @InjectRepository(ClubEntity)
    private readonly clubRepository: Repository<ClubEntity>,
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
}
