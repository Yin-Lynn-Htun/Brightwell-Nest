import { InpatientStatus } from 'src/constants';
import { Package } from 'src/package/entities/package.entity';
import { Patient } from 'src/patients/entities/patient.entity';
import { RoomType } from 'src/room-type/entities/room-type.entity';
import { Room } from 'src/room/entities/room.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('inpatient')
export class Inpatient {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Patient, (patient) => patient.purchases)
  patient: Patient;

  @ManyToOne(() => RoomType, (roomType) => roomType.inpatients)
  roomType: RoomType;

  @ManyToOne(() => Room, (room) => room.inpatients)
  room: Room;

  @Column()
  startDate: Date;

  @Column({
    nullable: true,
  })
  endDate: Date;

  @Column({ type: 'enum', enum: InpatientStatus })
  status: InpatientStatus;

  // TODO: Transcation

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
