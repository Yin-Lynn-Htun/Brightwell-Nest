import { IsEmail, IsEnum, IsNotEmpty, IsPostalCode } from 'class-validator';
import { Gender, Relationship } from 'src/patients/entities/patient.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

enum EmploymentType {
  FullTime = 'FullTime',
  PartTime = 'PartTime',
  Contract = 'Contract',
  Other = 'Other',
}

@Entity('staff')
export class Staff {
  @PrimaryGeneratedColumn()
  id: number;

  // account detail
  @Column({ type: 'varchar', length: 50 })
  @IsNotEmpty()
  firstName: string;

  @Column({ type: 'varchar', length: 50 })
  @IsNotEmpty()
  lastName: string;

  @Column({ type: 'varchar', length: 15 })
  // @IsPhoneNumber()
  phoneNumber: string;

  @Column({ type: 'varchar', length: 254 })
  @IsEmail()
  email: string;

  // contact info

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

  // personal detail

  @Column({
    type: 'enum',
    enum: Gender,
  })
  @IsEnum(Gender)
  gender: Gender;

  @Column({ type: 'varchar', length: 50, default: 'myanmar' })
  nationality: string;

  @Column({ type: 'date', default: () => 'NOW()' })
  dob: string;

  @Column({ type: 'varchar', length: 50 })
  idType: string;

  @Column({ type: 'varchar', length: 50 })
  idNumber: string;

  @Column({ type: 'text' })
  description: string;

  // Employment detail

  @Column({ type: 'varchar', length: 50 })
  @IsNotEmpty()
  position: string;

  @Column({ type: 'varchar', length: 50 })
  @IsNotEmpty()
  department: string;

  @Column({ type: 'date' })
  employmentStartDate: string;

  @Column({ type: 'date', nullable: true })
  employmentEndDate: string;

  @Column({ type: 'date', nullable: true })
  isCurrentlyWorking: string;

  @Column({ type: 'enum', enum: EmploymentType })
  @IsEnum(EmploymentType)
  employmentType: EmploymentType;

  @Column({ type: 'varchar', length: 20 })
  staffPassNo: string;

  @CreateDateColumn()
  created_at: Date;
}
