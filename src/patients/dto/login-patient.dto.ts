import { IsNotEmpty, Length } from 'class-validator';

export class LoginPatientDto {
  @IsNotEmpty()
  @Length(1, 50)
  email: string;

  @IsNotEmpty()
  @Length(1, 50)
  password: string;
}
