import { Injectable } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { Repository } from 'typeorm';
import { Schedule } from './entities/schedule.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { DayOfWeeks } from 'src/constants';
import { DoctorService } from 'src/doctor/doctor.service';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRespository: Repository<Schedule>,
    private readonly doctorRespository: DoctorService,
  ) {}

  async create(createScheduleDto: CreateScheduleDto) {
    const { doctorId, startDate, recurringEndDate, shifts } = createScheduleDto;

    const start = moment(startDate); // Parse the start date
    const end = moment(recurringEndDate); // Parse the end date

    const schedules: any = [];

    for (let date = start; date.isSameOrBefore(end); date.add(1, 'days')) {
      const dayOfWeek = date.day();

      for (const shift of shifts) {
        if (shift.dayOfWeek !== DayOfWeeks[dayOfWeek]) continue;

        const doctor = await this.doctorRespository.findOne(+doctorId);

        const schedule = this.scheduleRespository.create({
          // @ts-ignore
          doctor: doctor,
          date: date.toISOString(),
          startTime: shift.startTime,
          endTime: shift.endTime,
          maxBookings: shift.bookingLimit,
        });

        schedules.push(await this.scheduleRespository.save(schedule));
      }
    }

    return schedules;
  }

  async findAll() {
    return await this.scheduleRespository.find({
      relations: {
        doctor: true,
      },
    });
  }

  async findByDoctorId(doctorId: number) {
    return await this.scheduleRespository.findBy({
      doctor: {
        doctorId: doctorId,
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} schedule`;
  }

  update(id: number, updateScheduleDto: UpdateScheduleDto) {
    return `This action updates a #${id} schedule`;
  }

  remove(id: number) {
    return `This action removes a #${id} schedule`;
  }
}
