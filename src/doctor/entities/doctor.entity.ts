import { IsEnum, IsNotEmpty } from 'class-validator';
import { DoctorEdu } from 'src/doctor-edu/entities/doctor-edu.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Speciality } from 'src/specialities/entities/speciality.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Doctor {
  @PrimaryGeneratedColumn()
  doctorId: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  // doctor speciality
  @ManyToMany(() => Speciality, (specialty) => specialty.doctors)
  @JoinTable() // This creates the join table
  specialties: Speciality[];

  @Column({ type: 'varchar', array: true })
  languages: string[];

  // education
  @OneToMany(() => DoctorEdu, (education) => education.doctors)
  educations: DoctorEdu[];

  // schedules
  @OneToMany(() => Schedule, (schedule) => schedule.doctor)
  schedules: Schedule[];

  // TODO: Work exp

  @Column({ type: 'varchar', length: 50 })
  idType: string;

  @Column({ type: 'varchar', length: 50 })
  idNumber: string;
}
