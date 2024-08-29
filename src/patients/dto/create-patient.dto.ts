import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsPostalCode,
  Length,
} from 'class-validator';
import { Gender, Relationship } from '../entities/patient.entity'; // Adjust the path as needed

export class CreatePatientDto {
  @IsNotEmpty()
  @Length(1, 50)
  firstName: string;

  @IsNotEmpty()
  @Length(1, 50)
  lastName: string;

  @IsEmail()
  @Length(1, 254)
  email: string;

  @IsPhoneNumber()
  @Length(1, 15)
  phoneNumber: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsNotEmpty()
  @Length(1, 100)
  address: string;

  @IsNotEmpty()
  @Length(1, 50)
  city: string;

  @IsNotEmpty()
  @Length(1, 30)
  province: string;

  @IsPostalCode('any')
  postalCode: string;

  @IsNotEmpty()
  @Length(1, 50)
  eFirstName: string;

  @IsNotEmpty()
  @Length(1, 50)
  eLastName: string;

  @IsPhoneNumber()
  @Length(1, 15)
  eMobileNumber: string;

  @IsEmail()
  @Length(1, 254)
  eEmail: string;

  @Length(1, 254)
  password: string;

  @IsEnum(Relationship)
  eRelationship: Relationship;
}
