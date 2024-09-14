import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, Put } from '@nestjs/common';
import { SocioService } from './socio.service';
import { CreateSocioDto } from './dto/create-socio.dto';
import { UpdateSocioDto } from './dto/update-socio.dto';

@Controller('members')
export class SocioController {
  constructor(private readonly socioService: SocioService) {}

  @Post()
  async create(@Body() createSocioDto: CreateSocioDto) {
    try {
      return await this.socioService.create(createSocioDto);
    } catch (error) {
      throw error; 
    }
  }

  @Get()
  findAll() {
    return this.socioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.socioService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateSocioDto: UpdateSocioDto) {
    if (updateSocioDto.email && !this.isValidEmail(updateSocioDto.email)) {
      throw new BadRequestException('Correo electrónico inválido, debe contener un "@"');
    }
    return this.socioService.update(id, updateSocioDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.socioService.remove(id);
  }

  private isValidEmail(email: string): boolean {
    return email.includes('@');
  }
}
