import { Inpatient } from 'src/inpatient/entities/inpatient.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('inpatient-charge')
export class InpatientCharge {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal')
  amount: number;

  @ManyToOne(() => Inpatient, (inpatient) => inpatient.charges)
  inpatient: Inpatient;

  @Column('text', {
    nullable: true,
  })
  description: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
