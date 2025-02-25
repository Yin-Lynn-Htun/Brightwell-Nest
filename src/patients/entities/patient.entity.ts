import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { IsEmail, IsEnum, IsNotEmpty, IsPostalCode } from 'class-validator';
import { Appointment } from 'src/appointment/entities/appointment.entity';
import { Purchase } from 'src/purchase/entities/purchase.entity';
import { Inpatient } from 'src/inpatient/entities/inpatient.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { MedicalHistory } from 'src/medical-history/entities/medical-history.entity';

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

@Entity({ name: 'patients' })
export class Patient {
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

  @Column({ type: 'varchar', length: 254, default: 'test123!' })
  password: string;

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

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Appointment, (appointment) => appointment.patient, {
    onDelete: 'SET NULL',
  })
  appointments: Appointment[];

  @OneToMany(() => Purchase, (purchase) => purchase.patient)
  purchases: Purchase[];

  @OneToMany(() => Inpatient, (inpatient) => inpatient.patient)
  inpatients: Inpatient[];

  @OneToMany(() => Transaction, (transaction) => transaction.patient, {
    onDelete: 'SET NULL',
  })
  transactions: Transaction[];

  @OneToMany(() => MedicalHistory, (medicalHistory) => medicalHistory.patient)
  medicalHistories: MedicalHistory[];
}
