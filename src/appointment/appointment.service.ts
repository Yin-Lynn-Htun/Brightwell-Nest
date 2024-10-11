import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { PatientsService } from 'src/patients/patients.service';
import { ScheduleService } from 'src/schedule/schedule.service';
import { AppointmentStatus } from 'src/constants';
import { InjectRepository } from '@nestjs/typeorm';
import { SlotService } from 'src/slot/slot.service';
import { Slot, SlotStatus } from 'src/slot/entities/slot.entity';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    private readonly patientService: PatientsService,
    private readonly slotService: SlotService,
  ) {}

  async create(
    createAppointmentDto: CreateAppointmentDto & { patientId: number },
  ) {
    const { patientId, slotId } = createAppointmentDto;

    const patient = await this.patientService.findOne(patientId);
    const slot = await this.slotService.findOne(slotId);

    if (!patient || !slot) throw new BadRequestException();

    const appt = this.appointmentRepository.create({
      patient,
      slot,
      status: AppointmentStatus.BOOKED,
    });

    this.slotService.update(slot.id, {
      status: SlotStatus.Booked,
    });

    const data = await this.appointmentRepository.save(appt);

    return { ...data, responseMessage: 'Appointment created successfully!' };
  }

  async findAll() {
    return await this.appointmentRepository.find({
      relations: {
        patient: true,
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} appointment`;
  }

  update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    return `This action updates a #${id} appointment`;
  }

  remove(id: number) {
    return `This action removes a #${id} appointment`;
  }

  async getAppointments(date?: string, doctorIds?: number[]) {
    const query = this.appointmentRepository
      .createQueryBuilder('appointment')
      .innerJoinAndSelect('appointment.slot', 'slot') // Join slot relation
      .innerJoinAndSelect('slot.schedule', 'schedule') // Join schedule relation
      .innerJoinAndSelect('schedule.doctor', 'doctor') // Join doctor relation
      .innerJoinAndSelect('doctor.user', 'user') // Join doctor relation
      .innerJoinAndSelect('appointment.patient', 'patient'); // Join patient relation

    // Apply doctor filter if doctorIds are provided
    if (doctorIds && doctorIds.length > 0) {
      query.andWhere('doctor.doctorId IN (:...doctorIds)', { doctorIds });
    }

    // Apply date filter if provided, otherwise fetch both history and upcoming
    if (date) {
      const specificDate = new Date(date);

      // Set start and end of the specific date (midnight to 11:59:59)
      const startOfDay = new Date(specificDate.setHours(0, 0, 0, 0)); // Midnight
      const endOfDay = new Date(specificDate.setHours(23, 59, 59, 59)); // 23:59:59

      query.andWhere('schedule.date BETWEEN :startOfDay AND :endOfDay', {
        startOfDay,
        endOfDay,
      });
    } else {
      // If no date provided, fetch both past (history) and upcoming appointments
      query.orderBy('schedule.date', 'ASC');
    }

    const appointments = await query.getMany();

    return appointments.map((appointment) => ({
      slot: appointment.slot,
      doctor: {
        ...appointment.slot.schedule.doctor,
        ...appointment.slot.schedule.doctor.user,
      }, // Make sure doctor is loaded
      patient: appointment.patient,
    }));
  }

  async getRecentAppointments() {
    return this.appointmentRepository.find({
      relations: {
        patient: true,
      },
      order: {
        createdAt: 'DESC',
      },
      take: 5,
    });
  }

  private groupAppointmentsByDate(appointments: Appointment[]) {
    return appointments.reduce((grouped: GroupedAppointment[], appointment) => {
      const appointmentDate = new Date(appointment.slot.schedule.date)
        .toISOString()
        .split('T')[0]; // Extract the date part

      // Find if the date already exists in the result
      let dateGroup = grouped.find((group) => group.date === appointmentDate);

      // If the date group doesn't exist, create a new one
      if (!dateGroup) {
        dateGroup = {
          date: appointmentDate,
          appointments: [],
        };
        grouped.push(dateGroup);
      }

      // Add the appointment data to the date's appointments array
      dateGroup.appointments.push({
        slot: appointment.slot,
        doctor: appointment.slot.schedule.doctor, // Make sure doctor is loaded
        patient: appointment.patient,
      });

      return grouped;
    }, [] as GroupedAppointment[]);
  }
}
