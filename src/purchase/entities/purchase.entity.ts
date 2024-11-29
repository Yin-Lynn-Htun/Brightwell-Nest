import { PurchaseStatus } from 'src/constants';
import { Package } from 'src/package/entities/package.entity';
import { Patient } from 'src/patients/entities/patient.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('purchases')
export class Purchase {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Patient, (patient) => patient.purchases)
  patient: Patient;

  @ManyToOne(() => Package, (pkg) => pkg.purchases, {
    onDelete: 'CASCADE',
  })
  package: Package; // Optional relation

  @Column({ type: 'enum', enum: PurchaseStatus })
  status: PurchaseStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
