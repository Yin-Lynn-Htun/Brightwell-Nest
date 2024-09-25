import { Appointment } from 'src/appointment/entities/appointment.entity';
import { DayOfWeek } from 'src/constants';
import { Doctor } from 'src/doctor/entities/doctor.entity';
import { Room } from 'src/room/entities/room.entity';
import { Slot } from 'src/slot/entities/slot.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Doctor, (doctor) => doctor.schedules)
  doctor: Doctor;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: string;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column({ type: 'integer', default: 0 })
  maxBookings: number;

  @ManyToOne(() => Room, (room) => room.schedules)
  room: Room;

  @OneToMany(() => Slot, (slot) => slot.schedule)
  slots: Slot[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
