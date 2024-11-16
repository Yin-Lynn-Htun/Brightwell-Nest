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
}
