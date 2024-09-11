import { PurchaseStatus, RoomBookingStatus } from 'src/constants';
import { Package } from 'src/package/entities/package.entity';
import { Patient } from 'src/patients/entities/patient.entity';
import { Room } from 'src/room/entities/room.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('roomBooking')
export class RoomBooking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Patient, (patient) => patient.purchases)
  patient: Patient;

  @ManyToOne(() => Room, (room) => room.bookings)
  room: Room;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({ type: 'enum', enum: RoomBookingStatus })
  status: RoomBookingStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
