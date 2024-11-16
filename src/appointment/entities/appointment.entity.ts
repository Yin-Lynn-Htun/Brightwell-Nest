import { AppointmentStatus, AppointmentType } from 'src/constants';
import { Patient } from 'src/patients/entities/patient.entity';
import { Slot } from 'src/slot/entities/slot.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
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

  @OneToOne(() => Slot, (slot) => slot.appointment)
  slot: Slot; // Optional relation

  @Column({
    type: 'enum',
    enum: AppointmentType,
    default: AppointmentType.DOCTOR,
  })
  type: AppointmentType;

  @Column({ type: 'enum', enum: AppointmentStatus })
  status: AppointmentStatus;

  @Column('text', { nullable: true })
  description: string;

  @Column('text', { array: true, nullable: true }) // This defines an array of strings
  attachments: string[];

  @Column({ type: 'varchar', length: 50, nullable: true })
  allergy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
