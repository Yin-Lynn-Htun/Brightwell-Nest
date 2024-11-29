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
  description: string;

  @Column('text', {
    default: '',
  })
  imageUrl: string;

  @Column('decimal')
  price: number;

  @Column('decimal')
  normalPrice: number;

  @ManyToOne(() => Purchase, {
    onDelete: 'CASCADE',
  })
  purchases: Purchase[];

  @ManyToMany(() => Tag)
  @JoinTable()
  tags: Tag[];

  @CreateDateColumn()
  created_at: Date;
}
