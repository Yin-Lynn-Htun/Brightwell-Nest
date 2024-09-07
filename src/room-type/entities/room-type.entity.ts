import { IsNotEmpty } from 'class-validator';
import { RoomAmenity } from 'src/room-amenity/entities/room-amenity.entity';
import { RoomCharge } from 'src/room-charge/entities/room-charge.entity';
import {
  Column,
  CreateDateColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @CreateDateColumn()
  created_at: Date;
}
