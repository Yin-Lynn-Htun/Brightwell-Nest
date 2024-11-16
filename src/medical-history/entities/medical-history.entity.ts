import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

import { User } from 'src/user/entities/user.entity';
import { Patient } from 'src/patients/entities/patient.entity';

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

  @ManyToOne(() => User, (user) => user.medicalHistories)
  createdBy: User;

  @CreateDateColumn()
  created_at: Date;
}
