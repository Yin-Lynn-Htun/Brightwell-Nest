import { Patient } from 'src/patients/entities/patient.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export enum TransactionStatus {
  PENDING = 'Pending',
  SUCCESS = 'Success',
  FAIL = 'Fail',
  REFUND = 'Refund',
}

export enum TransactionType {
  PACKAGE = 'Package',
  APPOINTMENT = 'Appointment',
  INPATIENT = 'Inpatient',
  DEPOSIT = 'Deposit',
}

@Entity('transaction')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal')
  amount: number;

  @ManyToOne(() => Patient, (patient) => patient.transactions)
  patient: Patient;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type: TransactionType;

  // This will be the ID of the related entity (Package, Appointment, or Room Booking)
  @Column()
  referenceId: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
