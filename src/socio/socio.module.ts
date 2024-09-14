import { Module } from '@nestjs/common';
import { SocioService } from './socio.service';
import { SocioController } from './socio.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocioEntity } from './entities/socio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SocioEntity])],
  controllers: [SocioController],
  providers: [SocioService],
})
export class SocioModule {}
