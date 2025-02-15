import { Controller, Get, Post, Body, Param, Delete, BadRequestException, Put, HttpCode, NotFoundException } from '@nestjs/common';
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
  async findOne(@Param('id') id: string) {
    const socio = await this.socioService.findOne(id);
    if (!socio) {
      throw new NotFoundException(`El socio con el ${id} no existe`);
    }
    return socio;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateSocioDto: UpdateSocioDto) {
    if (updateSocioDto.email && !this.isValidEmail(updateSocioDto.email)) {
      throw new BadRequestException('Correo electrónico inválido, debe contener un "@"');
    }
    return this.socioService.update(id, updateSocioDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    return this.socioService.remove(id);
  }

  private isValidEmail(email: string): boolean {
    return email.includes('@');
  }
}
