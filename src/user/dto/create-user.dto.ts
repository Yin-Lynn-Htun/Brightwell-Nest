import {
  IsNotEmpty,
  IsEmail,
  IsEnum,
  IsString,
  IsOptional,
  IsPostalCode,
  Length,
  IsDateString,
} from 'class-validator';
import { Gender, Role } from '../entities/user.entity';
import { Relationship } from '../entities/user.entity';

export class CreateUserDto {
  // Account detail
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  lastName: string;

  @IsEmail()
  @Length(1, 254)
  email: string;

  @IsString()
  @Length(1, 254)
  imageUrl: string;

  @IsOptional()
  @IsString()
  @Length(1, 15)
  // Uncomment if phone number validation is needed
  // @IsPhoneNumber()
  phoneNumber: string;

  @IsString()
  password: string;

  @IsEnum(Role)
  role: Role; // Assuming role is stored by its ID

  // Contact info
  @IsEnum(Gender)
  gender: Gender;

  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  address: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  city: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 30)
  province: string;

  @IsPostalCode('any')
  postalCode: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  country: string = 'myanmar';

  // Emergency contact
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  eFirstName: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  eLastName: string;

  @IsOptional()
  @IsString()
  @Length(1, 15)
  // Uncomment if phone number validation is needed
  // @IsPhoneNumber()
  eMobileNumber: string;

  @IsEmail()
  @Length(1, 254)
  eEmail: string;

  @IsEnum(Relationship)
  eRelationship: Relationship;

  @IsDateString()
  dob: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  nationality: string = 'myanmar';
}
