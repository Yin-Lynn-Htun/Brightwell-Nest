import { Appointment } from 'src/appointment/entities/appointment.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';

export enum SlotStatus {
  Available = 'Available',
  Booked = 'Booked',
  Canceled = 'Canceled',
}

@Entity('slot')
export class Slot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column({
    type: 'enum',
    enum: SlotStatus,
    default: SlotStatus.Available,
  })
  status: SlotStatus;

  @ManyToOne(() => Schedule, (schedule) => schedule.slots)
  schedule: Schedule;

  @OneToOne(() => Appointment)
  @JoinColumn()
  appointment: Appointment; // Single appointment for each slot
}
