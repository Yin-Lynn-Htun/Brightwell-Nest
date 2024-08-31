import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Tag } from 'src/tag/entities/tag.entity';
import { Purchase } from 'src/purchase/entities/purchase.entity';

@Entity()
export class Package {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  description: string; // This field can be used for rich text editor content

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'date' })
  expireDate: string;

  @Column('decimal')
  price: number;

  @Column('decimal')
  normalPrice: number;

  @ManyToOne(() => Purchase)
  purchases: Purchase[];

  @ManyToMany(() => Tag)
  @JoinTable()
  tags: Tag[];

  @CreateDateColumn()
  created_at: Date;
}
