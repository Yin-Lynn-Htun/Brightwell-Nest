import { Length } from 'class-validator';

export class CreateUserDto {
  @Length(1, 50)
  password: string;
}
