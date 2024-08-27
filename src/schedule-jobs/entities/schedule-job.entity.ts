import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ScheduleJob {
  @PrimaryGeneratedColumn()
  scheduleJobId: number;

  @Column({ type: 'numeric', default: 1 })
  doctorId: number;

  @Column({ type: 'time', default: '11:00:00' })
  startTime: string;

  @Column({ type: 'time', default: '14:00:00' })
  endTime: string;

  @Column({ type: 'date', default: '2024-09-01' })
  startDate: string;

  @Column({ type: 'date', default: '2024-09-10' })
  endDate: string;

  @Column({ type: 'numeric', default: 0 })
  recurringCount: number;

  @Column({ type: 'varchar', length: 10 })
  dayOfWeek: string;

  @Column({ type: 'numeric' })
  bookLimit: string;

  @Column({ type: 'boolean', default: false })
  isComplete: boolean;
}
