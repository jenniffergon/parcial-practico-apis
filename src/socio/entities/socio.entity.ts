import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ClubEntity } from 'src/club/entities/club.entity';

@Entity()
export class SocioEntity {
@PrimaryGeneratedColumn('uuid')
id: string;

@Column('text')
name: string;
 
@Column('text')
email: string;

@Column('date')
fechaDeNacimiento: Date;

@ManyToMany(() => ClubEntity, (club) => club.socio)
@JoinTable()
club: ClubEntity[];
}