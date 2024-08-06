import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsEmail, IsEnum, IsNotEmpty, IsPostalCode } from 'class-validator';
import { Role } from 'src/role/entities/role.entity';

export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
}

export enum Relationship {
  Family = 'Family',
  Friend = 'Friend',
  Spouse = 'Spouse',
  Other = 'Other',
}

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  // account detail
  @Column({ type: 'varchar', length: 50 })
  @IsNotEmpty()
  firstName: string;

  @Column({ type: 'varchar', length: 50 })
  @IsNotEmpty()
  lastName: string;

  @Column({ type: 'varchar', length: 254 })
  @IsEmail()
  email: string;

  @Column({ type: 'varchar', length: 15 })
  // @IsPhoneNumber()
  phoneNumber: string;

  @Column({ type: 'text', default: 'test123!' })
  password: string;

  @ManyToOne(() => Role, (role) => role.users)
  role: Role;

  // contact info

  @Column({
    type: 'enum',
    enum: Gender,
  })
  @IsEnum(Gender)
  gender: Gender;

  @Column({ type: 'varchar', length: 100 })
  @IsNotEmpty()
  address: string;

  @Column({ type: 'varchar', length: 50 })
  @IsNotEmpty()
  city: string;

  @Column({ type: 'varchar', length: 30 })
  @IsNotEmpty()
  province: string;

  @Column({ type: 'varchar', length: 10 })
  @IsPostalCode('any')
  postalCode: string;

  @Column({ type: 'varchar', length: 50, default: 'myanmar' })
  country: string;

  // emergency contact
  @Column({ type: 'varchar', length: 50 })
  @IsNotEmpty()
  eFirstName: string;

  @Column({ type: 'varchar', length: 50 })
  @IsNotEmpty()
  eLastName: string;

  @Column({ type: 'varchar', length: 15 })
  // @IsPhoneNumber()
  eMobileNumber: string;

  @Column({ type: 'varchar', length: 254 })
  @IsEmail()
  eEmail: string;

  @Column({
    type: 'enum',
    enum: Relationship,
  })
  @IsEnum(Relationship)
  eRelationship: Relationship;

  @Column({ type: 'date', default: () => 'NOW()' })
  dob: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'varchar', length: 50, default: 'myanmar' })
  nationality: string;
}
