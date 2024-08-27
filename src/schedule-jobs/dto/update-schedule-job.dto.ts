import { PartialType } from '@nestjs/swagger';
import { CreateScheduleJobDto } from './create-schedule-job.dto';

export class UpdateScheduleJobDto extends PartialType(CreateScheduleJobDto) {}
