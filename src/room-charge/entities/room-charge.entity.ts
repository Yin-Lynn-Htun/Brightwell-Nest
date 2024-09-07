import { RoomType } from 'src/room-type/entities/room-type.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class RoomCharge {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @ManyToOne(() => RoomType, (roomType) => roomType.charges)
  roomType: RoomType;

  @CreateDateColumn()
  created_at: Date;
}
