import { Type } from 'class-transformer';
import { IsString, IsDate, IsOptional, Length } from 'class-validator';

export class UpdateClubDto {
  @IsString()
  @IsOptional()
  readonly nombre?: string;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  readonly fechaDeFundacion?: Date;

  @IsString()
  @IsOptional()
  readonly imagen?: string;

  @IsString()
  @Length(1, 100)
  @IsOptional()
  readonly descripcion?: string;
}
