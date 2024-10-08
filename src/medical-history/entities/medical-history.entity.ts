import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { User } from 'src/user/entities/user.entity';
import { Patient } from 'src/patients/entities/patient.entity';
import { Doctor } from 'src/doctor/entities/doctor.entity';

export enum MedicalHistoryCategory {
  General = 'General',
  Diagnosis = 'Diagnosis',
  Prescription = 'Prescription',
  Others = 'Others',
}

@Entity({ name: 'medical_histories' })
export class MedicalHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: MedicalHistoryCategory,
    default: MedicalHistoryCategory.Others,
  })
  category: MedicalHistoryCategory;

  @Column({ type: 'text' })
  description: string;

  // @OneToMany(() => MedicalHistoryFile, (file) => file.medicalHistory, {
  //   cascade: true,
  // })
  // files: MedicalHistoryFile[];

  @ManyToOne(() => Patient, (patient) => patient.medicalHistories)
  patient: Patient;

  @Column('text', { array: true, nullable: true }) // This defines an array of strings
  attachments: string[];

  @ManyToOne(() => Doctor, (doctor) => doctor.medicalHistories)
  createdBy: Doctor;

  @CreateDateColumn()
  created_at: Date;
}
