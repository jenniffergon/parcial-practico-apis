import { Controller, Get, Post, Body, Param, Delete, Put, HttpCode, BadRequestException, NotFoundException, PreconditionFailedException } from '@nestjs/common';
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

  @Post(':clubId/members/:socioId')
  addMemberToClub(@Param('clubId') clubId: string, @Param('socioId') socioId: string) {
    return this.clubService.addMemberToClub(clubId, socioId);
  }

  @Get(':clubId/members')
  findMembersFromClub(@Param('clubId') clubId: string) {
    return this.clubService.findMembersFromClub(clubId);
  }

  @Get(':clubId/members/:socioId')
  findMemberFromClub(@Param('clubId') clubId: string, @Param('socioId') socioId: string) {
    return this.clubService.findMemberFromClub(clubId, socioId);
  }

  @Put(':clubId/members')
  async updateMembers( @Param('clubId') clubId: string, @Body('members') memberIds: string[] ) {
    if (!Array.isArray(memberIds)) {
      throw new BadRequestException('El cuerpo de la solicitud debe contener un array de IDs de socios');
    }

    return this.clubService.updateMembersFromClub(clubId, memberIds);
  }

  @Delete(':clubId/members/:socioId')
  @HttpCode(204)
  async deleteMember( @Param('clubId') clubId: string, @Param('socioId') socioId: string ) {
    try {
      return await this.clubService.deleteMemberFromClub(clubId, socioId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else if (error instanceof PreconditionFailedException) {
        throw new PreconditionFailedException(error.message);
      } else {
        throw error;
      }
    }
  }
}
