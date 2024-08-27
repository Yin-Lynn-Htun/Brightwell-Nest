import { Module } from '@nestjs/common';
import { ScheduleJobsService } from './schedule-jobs.service';
import { ScheduleJobsController } from './schedule-jobs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleJob } from './entities/schedule-job.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ScheduleJob])],
  controllers: [ScheduleJobsController],
  providers: [ScheduleJobsService],
})
export class ScheduleJobsModule {}
