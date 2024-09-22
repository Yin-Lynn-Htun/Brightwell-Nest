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
export class Deposit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal')
  amount: number;

  @ManyToOne(() => Inpatient, (inpatient) => inpatient.deposits)
  inpatient: Inpatient;

  @Column({
    type: 'enum',
    enum: DepositStatus,
    default: DepositStatus.PENDING,
  })
  status: DepositStatus;

  @Column({
    nullable: true,
  })
  transactionId: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
