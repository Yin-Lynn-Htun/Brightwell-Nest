import { Injectable } from '@nestjs/common';
import { CreateScheduleJobDto } from './dto/create-schedule-job.dto';
import { UpdateScheduleJobDto } from './dto/update-schedule-job.dto';
import { Repository } from 'typeorm';
import { ScheduleJob } from './entities/schedule-job.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ScheduleJobsService {
  constructor(
    @InjectRepository(ScheduleJob)
    private readonly scheduleJobsRepository: Repository<ScheduleJob>,
  ) {}

  async create(createScheduleJobDto: CreateScheduleJobDto) {
    const { doctorId, startDate, recurringEndDate, recurringCount, shifts } =
      createScheduleJobDto;

    const values: any = [];

    console.log(createScheduleJobDto, 'createScheduleJobDto');

    console.log(shifts, 'shifts');

    shifts.forEach(async (shift) => {
      const job = this.scheduleJobsRepository.create({
        // @ts-ignore
        doctorId: +doctorId as number,
        startTime: shift.startTime,
        endTime: shift.endTime,
        startDate: startDate,
        endDate: recurringEndDate,
        recurringCount: recurringCount,
        bookLimit: shift.bookingLimit,
        dayOfWeek: shift.dayOfWeek,
      });
      console.log('here here');

      const temp = await this.scheduleJobsRepository.save(job);
      values.push(temp);
    });

    console.log(values);

    return 'This background jobs are saved!';
  }

  async findAll() {
    return await this.scheduleJobsRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} scheduleJob`;
  }

  update(id: number, updateScheduleJobDto: UpdateScheduleJobDto) {
    return `This action updates a #${id} scheduleJob`;
  }

  remove(id: number) {
    return `This action removes a #${id} scheduleJob`;
  }
}
