import { Doctor } from 'src/doctor/entities/doctor.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum Status {
  Active = 'Active',
  Inactive = 'Inactive',
}

@Entity({ name: 'specialities' })
export class Speciality {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @CreateDateColumn()
  createdOn: Date;

  @ManyToMany(() => Doctor, (doctor) => doctor.specialties)
  doctors: Doctor[];

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.Active,
  })
  status: Status;
}
