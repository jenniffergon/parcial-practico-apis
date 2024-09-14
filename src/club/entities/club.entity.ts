import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SocioEntity } from 'src/socio/entities/socio.entity';

@Entity()
export class ClubEntity {
@PrimaryGeneratedColumn('uuid')
id: string;

@Column('text')
name: string;

@Column('date')
fechaDeFundacion: Date;
 
@Column('text')
descripcion: string;

@ManyToMany(() => SocioEntity, (socio) => socio.club)
socio: SocioEntity[];
}