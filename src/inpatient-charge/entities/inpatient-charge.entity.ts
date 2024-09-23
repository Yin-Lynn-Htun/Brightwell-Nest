import { Inpatient } from 'src/inpatient/entities/inpatient.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export enum DepositStatus {
  PENDING = 'Pending',
  SUCCESS = 'Success',
}

export enum TransactionType {
  PACKAGE = 'Package',
  APPOINTMENT = 'Appointment',
  INPATIENT = 'Inpatient',
}

@Entity('deposit')
export class InpatientCharge {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal')
  amount: number;

  @ManyToOne(() => Inpatient, (inpatient) => inpatient.deposits)
  inpatient: Inpatient;

  @Column('text', {
    nullable: true,
  })
  description: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
