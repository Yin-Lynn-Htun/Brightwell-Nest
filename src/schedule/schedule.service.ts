import { Injectable } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { Between, Repository } from 'typeorm';
import { Schedule } from './entities/schedule.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { DayOfWeeks } from 'src/constants';
import { DoctorService } from 'src/doctor/doctor.service';
import { getWeekDates } from 'src/utils';

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

  async findByDoctorIdAndDate(doctorId: number, date: string) {
    const targetDate = new Date(date);
    const weekDates = getWeekDates(targetDate);

    const response = [];

    for (const day of weekDates) {
      // Fetch all schedules for this doctor within the week range (you can optimize by narrowing it down to the week range if needed)
      const schedules = await this.scheduleRespository.find({
        where: {
          doctor: {
            doctorId: doctorId,
          },
        },
      });

      // Filter the schedules that fall on the current `day`
      const schedulesForDay = schedules.filter((schedule) =>
        moment(schedule.date).isSame(day, 'day'),
      );

      console.log('here', day);

      response.push({
        date: day,
        schedules: schedulesForDay.map((schedule) => ({
          id: schedule.id,
          startTime: schedule.startTime, // Adjust as per your entity
          endTime: schedule.endTime, // Adjust as per your entity
        })),
      });
    }

    return response;
  }

  async findOne(id: number) {
    return await this.scheduleRespository.findOne({
      where: {
        id: id,
      },
      relations: ['appointments', 'doctor.user', 'appointments.patient'],
    });
  }

  update(id: number, updateScheduleDto: UpdateScheduleDto) {
    return `This action updates a #${id} schedule`;
  }

  remove(id: number) {
    return `This action removes a #${id} schedule`;
  }
}
