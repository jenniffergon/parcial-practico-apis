import { Module } from '@nestjs/common';
import { ClubService } from './club.service';
import { ClubController } from './club.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubEntity } from './entities/club.entity';
import { SocioEntity } from 'src/socio/entities/socio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClubEntity, SocioEntity])],
  controllers: [ClubController],
  providers: [ClubService],
})
export class ClubModule {}
