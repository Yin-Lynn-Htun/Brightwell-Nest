import { InpatientStatus } from 'src/constants';
import { Deposit } from 'src/deposit/entities/deposit.entity';
import { InpatientCharge } from 'src/inpatient-charge/entities/inpatient-charge.entity';
import { Patient } from 'src/patients/entities/patient.entity';
import { RoomType } from 'src/room-type/entities/room-type.entity';
import { Room } from 'src/room/entities/room.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Deposit, (deposit) => deposit.inpatient)
  deposits: Deposit[];

  @OneToMany(() => InpatientCharge, (charge) => charge.inpatient)
  charges: InpatientCharge[];
}
