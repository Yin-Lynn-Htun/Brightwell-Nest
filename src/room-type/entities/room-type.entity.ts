import { IsNotEmpty } from 'class-validator';
import { RoomAmenity } from 'src/room-amenity/entities/room-amenity.entity';
import { RoomCharge } from 'src/room-charge/entities/room-charge.entity';
import { Room } from 'src/room/entities/room.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class RoomType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  @IsNotEmpty()
  name: string;

  @Column()
  description: string;

  @OneToMany(() => RoomCharge, (charge) => charge.roomType)
  charges: RoomCharge[];

  @ManyToMany(() => RoomAmenity)
  @JoinTable()
  amenities: RoomAmenity[];

  @OneToMany(() => Room, (room) => room.roomType)
  rooms: Room[];

  @CreateDateColumn()
  created_at: Date;
}
