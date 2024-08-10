import { Doctor } from 'src/doctor/entities/doctor.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DoctorExp {
  @PrimaryGeneratedColumn()
  id: number;

  // @Column({ type: 'enum', enum: Degree })
  // degree: Degree;

  @Column({ type: 'varchar', length: 50 })
  institution: string;

  @Column({ type: 'varchar', length: 50 })
  fieldOfStudy: string;

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'date' })
  endDate: string;

  @ManyToOne(() => Doctor, (doctor) => doctor.educations)
  doctor: Doctor;
}
