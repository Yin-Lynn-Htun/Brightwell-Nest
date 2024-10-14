import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateAppointmentDto,
  CreateServiceAppointmentDto,
} from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { PatientsService } from 'src/patients/patients.service';
import { AppointmentStatus, AppointmentType } from 'src/constants';
import { InjectRepository } from '@nestjs/typeorm';
import { SlotService } from 'src/slot/slot.service';
import { Slot, SlotStatus } from 'src/slot/entities/slot.entity';
import * as moment from 'moment';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    private readonly patientService: PatientsService,
    private readonly slotService: SlotService,

    @InjectRepository(Slot)
    private readonly slotRepository: Repository<Slot>,
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

  async findOne(id: number) {
    return await this.appointmentRepository.findOne({
      where: {
        id,
      },
    });
  }

  async update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    const appt = await this.findOne(id);
    if (!appt) throw new NotFoundException('Appointment not found!');

    Object.assign(appt, updateAppointmentDto);

    return await this.appointmentRepository.save(appt);
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
      console.log('here doctor Ids', doctorIds);
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

  async getServiceAppointments(date?: string, type?: string) {
    const query = this.appointmentRepository
      .createQueryBuilder('appointment')
      .innerJoinAndSelect('appointment.slot', 'slot') // Join slot relation
      .innerJoinAndSelect('appointment.patient', 'patient'); // Join patient relation

    if (type) {
      query.andWhere('appointment.type', { type });
    } else {
      query.andWhere('appointment.type IN (:...type)', {
        type: [AppointmentType.MEDICAL_CHECKUP, AppointmentType.VACCINATION],
      });
    }

    // Apply date filter if provided, otherwise fetch both history and upcoming
    if (date) {
      const specificDate = new Date(date);

      // Set start and end of the specific date (midnight to 11:59:59)
      const startOfDay = new Date(specificDate.setHours(0, 0, 0, 0)); // Midnight
      const endOfDay = new Date(specificDate.setHours(23, 59, 59, 59)); // 23:59:59

      query.andWhere('slot.date BETWEEN :startOfDay AND :endOfDay', {
        startOfDay,
        endOfDay,
      });
    } else {
      // If no date provided, fetch both past (history) and upcoming appointments
      query.orderBy('slot.date', 'ASC');
    }

    const appointments = await query.getMany();

    return appointments.map((appointment) => ({
      ...appointment,
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

  // Method to handle booking an appointment
  async bookServiceAppointment({
    patientId,
    medicalType,
    date,
    startTime,
    endTime,
    allergy,
    attachments,
    description,
  }: CreateServiceAppointmentDto & {
    patientId: number;
  }): Promise<Appointment> {
    // Check if the slot already exists
    let slot = await this.slotRepository.findOne({
      where: {
        startTime: startTime,
        endTime: endTime,
        status: SlotStatus.Available, // Check only available slots
      },
    });

    if (!slot) {
      // If no slot exists, create a new one
      slot = new Slot();
      slot.date = date;
      slot.startTime = startTime;
      slot.endTime = endTime;
      slot.status = SlotStatus.Booked; // Mark it as booked immediately
      slot = await this.slotRepository.save(slot);
    } else {
      // If the slot exists, mark it as "Booked"
      slot.status = SlotStatus.Booked;
      await this.slotRepository.save(slot);
    }

    const patient = await this.patientService.findOne(patientId);

    if (!patient) throw new NotFoundException('Patient not found!');

    const appointment = new Appointment();
    appointment.patient = patient;
    appointment.slot = slot;
    appointment.type = medicalType;
    appointment.status = AppointmentStatus.BOOKED;
    appointment.allergy = allergy ?? '';
    appointment.attachments = attachments ?? [];
    appointment.description = description ?? '';
    await this.appointmentRepository.save(appointment);

    return appointment;
  }
}
