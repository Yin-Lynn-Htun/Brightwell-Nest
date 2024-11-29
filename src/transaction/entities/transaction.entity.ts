import { Patient } from 'src/patients/entities/patient.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum TransactionStatus {
  PENDING = 'Pending',
  SUCCESS = 'Success',
  FAIL = 'Fail',
  REFUND = 'Refund',
}

export enum TransactionType {
  PACKAGE = 'Package',
  APPOINTMENT = 'Appointment',
  FOLLOW_UP_CHARGES = 'Follow_Up_Charges', // for appointment
  INPATIENT = 'Inpatient',
  DEPOSIT = 'Deposit',
  ROOM_DEPOSIT = 'RoomDeposit',
}

export enum TransactionChannel {
  credit_card = 'credit_card',
  mobile_banking = 'mobile_banking',
  qr_payment = 'qr_payment',
  'on_site_payment' = 'on_site_payment',
}

@Entity('transaction')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal')
  amount: number;

  @ManyToOne(() => Patient, (patient) => patient.transactions, {
    onDelete: 'CASCADE',
  })
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

  @Column({
    type: 'enum',
    nullable: true,
    enum: TransactionChannel,
  })
  channel: TransactionChannel;

  // This will be the ID of the related entity (Package, Appointment, or Room Booking)
  @Column({
    nullable: true,
  })
  referenceId: number;

  @CreateDateColumn()
  createdAt: Date;
}
