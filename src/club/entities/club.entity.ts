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
  imagen: string;

  @Column({ type: 'varchar', length: 100 })
  descripcion: string;

  @ManyToMany(() => SocioEntity, (socio) => socio.clubs)
  socios: SocioEntity[];
}
