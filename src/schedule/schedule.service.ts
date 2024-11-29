import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { Between, Repository } from 'typeorm';
import { Schedule } from './entities/schedule.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { AppointmentStatus, DayOfWeeks } from 'src/constants';
import { DoctorService } from 'src/doctor/doctor.service';
import { getWeekDates } from 'src/utils';
import { RoomService } from 'src/room/room.service';
import { SlotService } from 'src/slot/slot.service';
import { Slot, SlotStatus } from 'src/slot/entities/slot.entity';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,

    @InjectRepository(Slot)
    private readonly slotRepository: Repository<Slot>,

    private readonly doctorRespository: DoctorService,
    private readonly roomRespository: RoomService,
  ) {}
  // Check if the room is available for a specific time slot on a specific date
  async isRoomAvailable(
    roomId: number,
    startTime: string,
    endTime: string,
    date: string, // Specific date to check
  ): Promise<boolean> {
    const overlappingSchedule = await this.scheduleRepository
      .createQueryBuilder('schedule')
      .innerJoinAndSelect('schedule.room', 'room')
      .where('room.id = :roomId', { roomId })
      .andWhere('schedule.date = :date', { date }) // Check for specific date
      .andWhere(
        '(schedule.startTime < :endTime AND schedule.endTime > :startTime)', // Overlap check
        { startTime, endTime },
      )
      .getOne();

    return !overlappingSchedule; // Return true if no conflicts, false if conflict found
  }

  // Calculate the specific dates for recurring shifts
  calculateRecurringDates(
    startDate: string,
    endDate: string,
    dayOfWeek: string,
  ): string[] {
    const recurringDates: string[] = [];
    let currentDate = moment(startDate);

    // Find the first occurrence of the day of the week
    while (currentDate.format('dddd') !== dayOfWeek) {
      currentDate = currentDate.add(1, 'day');
    }

    // Loop through each week between startDate and endDate
    while (currentDate.isSameOrBefore(moment(endDate))) {
      recurringDates.push(currentDate.format('YYYY-MM-DD'));
      currentDate = currentDate.add(1, 'week');
    }

    return recurringDates;
  }

  // Validate room availability for all recurring shifts
  async validateRoomAvailability(
    shifts: any[],
    startDate: string,
    endDate: string,
  ): Promise<void> {
    for (const shift of shifts) {
      // Calculate all the dates where the shift occurs (recurring)
      const recurringDates = this.calculateRecurringDates(
        startDate,
        endDate,
        shift.dayOfWeek,
      );

      // Validate room availability for each date
      for (const date of recurringDates) {
        const roomAvailable = await this.isRoomAvailable(
          shift.roomId,
          shift.startTime,
          shift.endTime,
          date, // Pass the specific recurring date
        );
        if (!roomAvailable) {
          throw new BadRequestException(
            `Room ${shift.name} is already occupied during ${shift.startTime} - ${shift.endTime} on ${shift.dayOfWeek} (${date})`,
          );
        }
      }
    }
  }

  async create(createScheduleDto: CreateScheduleDto) {
    const { doctorId, startDate, recurringEndDate, shifts } = createScheduleDto;

    console.log(createScheduleDto);

    const start = moment(startDate); // Parse the start date
    const end = moment(recurringEndDate); // Parse the end date

    const schedules: any = [];

    // Validate room availability before creating the schedule
    await this.validateRoomAvailability(shifts, startDate, recurringEndDate);

    for (let date = start; date.isSameOrBefore(end); date.add(1, 'days')) {
      const dayOfWeek = date.day();

      for (const shift of shifts) {
        if (shift.dayOfWeek !== DayOfWeeks[dayOfWeek]) continue;

        const doctor = await this.doctorRespository.findOne(+doctorId);
        if (!doctor) throw new NotFoundException('Doctor not found!');

        const room = await this.roomRespository.findOne(+shift.roomId);
        if (!room) throw new NotFoundException('Room not found!');

        const schedule = this.scheduleRepository.create({
          doctor: doctor,
          date: date.toISOString(),
          startTime: shift.startTime,
          endTime: shift.endTime,
          room: room,
        });

        const savedSchedule = await this.scheduleRepository.save(schedule);

        // Generate slots in 10-minute intervals
        const slots = this.generateSlots(
          shift.startTime,
          shift.endTime,
          savedSchedule,
        );

        // Save all slots associated with the schedule
        for (const slot of slots) {
          await this.slotRepository.save(slot);
        }
      }
    }

    return { ...schedules, responseMessage: 'Created schedule successfully.' };
  }

  // Utility function to generate 10-minute slots for each shift
  generateSlots(startTime: string, endTime: string, schedule: Schedule) {
    const slots = [];
    const slotDuration = 10; // Duration in minutes
    const start = moment(startTime, 'HH:mm');
    const end = moment(endTime, 'HH:mm');

    while (start.isBefore(end)) {
      const nextSlot = start.clone().add(slotDuration, 'minutes');

      // Create slot object
      const slot = this.slotRepository.create({
        startTime: start.format('HH:mm'),
        endTime: nextSlot.format('HH:mm'),
        status: SlotStatus.Available, // Set initial status
        schedule: schedule, // Associate with the schedule
      });

      slots.push(slot);

      // Move to the next 10-minute slot
      start.add(slotDuration, 'minutes');
    }

    return slots;
  }

  async findAll() {
    return await this.scheduleRepository.find({
      relations: {
        doctor: true,
      },
    });
  }

  async findByDoctorId(doctorId: number) {
    return await this.scheduleRepository.find({
      where: {
        doctor: {
          doctorId: doctorId,
        },
      },
      relations: {
        slots: true,
      },
    });
  }

  async findByDoctorIdAndDate(doctorId: number, date: string) {
    const targetDate = new Date(date);
    const weekDates = getWeekDates(targetDate);

    const response = [];

    for (const day of weekDates) {
      // Fetch all schedules for this doctor within the week range (you can optimize by narrowing it down to the week range if needed)
      const schedules = await this.scheduleRepository.find({
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
    return await this.scheduleRepository
      .createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.doctor', 'doctor')
      .leftJoinAndSelect('doctor.user', 'user')
      .leftJoinAndSelect('schedule.slots', 'slot', 'slot.status = :status', {
        status: SlotStatus.Booked,
      })
      .leftJoinAndSelect('schedule.room', 'room')
      .leftJoinAndSelect('slot.appointment', 'appointment')
      .leftJoinAndSelect('appointment.patient', 'patient')
      .where('schedule.id = :id', { id })
      .getOne();
  }

  update(id: number, updateScheduleDto: UpdateScheduleDto) {
    return `This action updates a #${id} schedule`;
  }

  remove(id: number) {
    return `This action removes a #${id} schedule`;
  }

  async getSlotsForSchedule(scheduleId: number) {
    const schedule = await this.scheduleRepository.findOne({
      where: { id: scheduleId },
      relations: ['slots'], // Ensure it loads related slots
    });

    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${scheduleId} not found`);
    }

    return schedule.slots;
  }
}
