import { Controller, Get, Post, Body, Param, Delete, Put, HttpCode } from '@nestjs/common';
import { ClubService } from './club.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';

@Controller('clubs')
export class ClubController {
  constructor(private readonly clubService: ClubService) {}

  @Post()
  async create(@Body() createClubDto: CreateClubDto) {
    try{
      return this.clubService.create(createClubDto);
    } catch (error) {
      throw error; 
    }
  }

  @Get()
  findAll() {
    return this.clubService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clubService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateClubDto: UpdateClubDto) {
    return this.clubService.update(id, updateClubDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    return this.clubService.remove(id);
  }
}
