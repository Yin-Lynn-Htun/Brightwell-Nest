import { IsEnum, IsNotEmpty } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum EmploymentType {
  FullTime = 'FullTime',
  PartTime = 'PartTime',
  Contract = 'Contract',
  Other = 'Other',
}

@Entity()
export class Staff {
  @PrimaryGeneratedColumn()
  staffId: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  // personal detail
  @Column({ type: 'varchar', length: 50 })
  idType: string;

  @Column({ type: 'varchar', length: 50 })
  idNumber: string;

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

  @Column({ type: 'boolean', nullable: true })
  isCurrentlyWorking: string;

  @Column({ type: 'enum', enum: EmploymentType })
  @IsEnum(EmploymentType)
  employmentType: EmploymentType;

  @Column({ type: 'varchar', length: 20 })
  staffPassNo: string;
}
