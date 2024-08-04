import { Status } from 'src/specialities/entities/speciality.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'role' })
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @CreateDateColumn()
  createdOn: Date;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.Active,
  })
  status: Status;

  @Column({ type: 'text' })
  modules: string;
}
