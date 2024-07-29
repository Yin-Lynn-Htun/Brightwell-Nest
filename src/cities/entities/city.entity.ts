import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// cities here is the DB name
@Entity({ name: 'cities' })
export class City {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'boolean', default: true })
  active: boolean;
}
