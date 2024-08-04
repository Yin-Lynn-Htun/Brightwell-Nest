import { IsEmail, IsEnum, IsNotEmpty, IsPostalCode } from 'class-validator';
import { Gender } from 'src/patients/entities/patient.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('staff')
export class Staff {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  @IsNotEmpty()
  firstName: string;

  @Column({ type: 'varchar', length: 50 })
  @IsNotEmpty()
  lastName: string;

  @Column({ type: 'varchar', length: 254 })
  @IsEmail()
  email: string;

  @Column({ type: 'date', default: () => 'NOW()' })
  dob: string;

  @Column({ type: 'varchar', length: 15 })
  // @IsPhoneNumber()
  phoneNumber: string;

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

  @Column({ type: 'varchar', length: 50 })
  @IsNotEmpty()
  position: string;

  @Column({ type: 'varchar', length: 50 })
  @IsNotEmpty()
  department: string;

  @Column({ type: 'varchar', length: 50 })
  @IsNotEmpty()
  staffPassNo: string;

  @Column({ type: 'text' })
  description: string;

  @CreateDateColumn()
  created_at: Date;
}
