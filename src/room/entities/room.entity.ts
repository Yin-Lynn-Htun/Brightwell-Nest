import { IsNotEmpty } from 'class-validator';
import { RoomCharge } from 'src/room-charge/entities/room-charge.entity';
import { RoomType } from 'src/room-type/entities/room-type.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum RoomTypeStatus {
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
    enum: RoomTypeStatus,
    default: RoomTypeStatus.Available,
  })
  status: RoomType;

  @CreateDateColumn()
  created_at: Date;
}
