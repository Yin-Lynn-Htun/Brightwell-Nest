import { AppointmentStatus } from 'src/constants';
import { Doctor } from 'src/doctor/entities/doctor.entity';
import { Patient } from 'src/patients/entities/patient.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Slot } from 'src/slot/entities/slot.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// Appointment entity
@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Patient, (patient) => patient.appointments)
  patient: Patient;

  @OneToOne(() => Slot)
  @JoinColumn()
  slot: Slot; // Optional relation

  @Column({ type: 'enum', enum: AppointmentStatus })
  status: AppointmentStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
