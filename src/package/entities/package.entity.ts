import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Tag } from 'src/tag/entities/tag.entity';

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

  @ManyToMany(() => User)
  @JoinTable()
  users: User[];

  @ManyToMany(() => Tag)
  @JoinTable()
  tags: Tag[];

  @CreateDateColumn()
  created_at: Date;
}
