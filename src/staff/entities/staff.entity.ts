import { IsEnum, IsNotEmpty } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import { ChildEntity, Column, Entity } from 'typeorm';

enum EmploymentType {
  FullTime = 'FullTime',
  PartTime = 'PartTime',
  Contract = 'Contract',
  Other = 'Other',
}

@Entity()
export class Staff extends User {
  // personal detail
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
}
