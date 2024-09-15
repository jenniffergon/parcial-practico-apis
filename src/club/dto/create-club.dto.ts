import { Type } from 'class-transformer';
import { IsString, IsDate, Length } from 'class-validator';

export class CreateClubDto {
  @IsString()
  @Length(1, 100)
  readonly nombre: string;

  @Type(() => Date)
  @IsDate()
  readonly fechaDeFundacion: Date;

  @IsString()
  @Length(1, 255)
  readonly imagen: string;

  @IsString()
  @Length(1, 100)
  readonly descripcion: string;
}