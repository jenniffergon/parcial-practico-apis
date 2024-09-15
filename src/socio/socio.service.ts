import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateSocioDto } from './dto/create-socio.dto';
import { UpdateSocioDto } from './dto/update-socio.dto';
import { SocioEntity } from './entities/socio.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SocioService {
  constructor(
    @InjectRepository(SocioEntity)
    private readonly socioRepository: Repository<SocioEntity>,
  ) {}

  async create(createSocioDto: CreateSocioDto): Promise<SocioEntity> {
    this.validateEmail(createSocioDto.email);
    const socio = this.socioRepository.create(createSocioDto);
    return this.socioRepository.save(socio);
  }

  async findAll(): Promise<SocioEntity[]> {
    return this.socioRepository.find();
  }

  async findOne(id: string): Promise<SocioEntity> {
    const socio = await this.socioRepository.findOne({ where: { id } });
    if (!socio) {
      throw new NotFoundException('Socio no encontrado');
    }
    return socio;
  }

  async update(id: string, updateSocioDto: UpdateSocioDto): Promise<SocioEntity> {
    if (updateSocioDto.email) {
      this.validateEmail(updateSocioDto.email);
    }
    
    if (updateSocioDto.fechaDeNacimiento) {
      updateSocioDto.fechaDeNacimiento = new Date(updateSocioDto.fechaDeNacimiento);
    }
    
    await this.socioRepository.update(id, updateSocioDto);
    return this.findOne(id);
  }
  

  async remove(id: string): Promise<void> {
    const socio = await this.findOne(id);
    await this.socioRepository.remove(socio);
  }

  private validateEmail(email: string): void {
    if (!email.includes('@')) {
      throw new BadRequestException('Correo electrónico inválido, debe contener un "@"');
    }
  }
}
