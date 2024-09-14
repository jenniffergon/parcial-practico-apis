import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateSocioDto {
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsEmail({}, { message: 'Correo electrónico inválido' })
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly fechaDeNacimiento: string;
}
