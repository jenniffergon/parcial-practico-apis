import { Column, Entity, ManyToMany, PrimaryGeneratedColumn, JoinTable } from 'typeorm';
import { ClubEntity } from 'src/club/entities/club.entity';
import { IsEmail } from 'class-validator';

@Entity()
export class SocioEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  nombre: string;

  @IsEmail({}, { message: 'Correo electrónico inválido' })
  @Column('text')
  email: string;

  @Column('date')
  fechaDeNacimiento: Date;

  @ManyToMany(() => ClubEntity, (club) => club.socios)
  @JoinTable()  
  clubs: ClubEntity[];
}
