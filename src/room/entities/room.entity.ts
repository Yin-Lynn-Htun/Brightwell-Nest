import { IsNotEmpty } from 'class-validator';
import { Inpatient } from 'src/inpatient/entities/inpatient.entity';
import { RoomCharge } from 'src/room-charge/entities/room-charge.entity';
import { RoomType } from 'src/room-type/entities/room-type.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum RoomStatus {
  Available = 'Available',
  Occupied = 'Occupied',
}

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  @IsNotEmpty()
  name: string;

  @Column()
  floorLevel: string;

  @ManyToOne(() => RoomType, (roomType) => roomType.rooms)
  roomType: RoomType;

  @Column({
    type: 'enum',
    enum: RoomStatus,
    default: RoomStatus.Available,
  })
  status: RoomStatus;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Inpatient)
  inpatients: Inpatient[];
}
