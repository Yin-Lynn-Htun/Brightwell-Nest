import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { PatientsService } from 'src/patients/patients.service';
import { ScheduleService } from 'src/schedule/schedule.service';
import { AppointmentStatus } from 'src/constants';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    private readonly patientService: PatientsService,
    private readonly scheduleService: ScheduleService,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto) {
    const { patientId, scheduleId } = createAppointmentDto;

    const patient = await this.patientService.findOne(patientId);
    const schedule = await this.scheduleService.findOne(scheduleId);

    if (!patient || !schedule) throw new BadRequestException();

    const appt = this.appointmentRepository.create({
      patient,
      schedule,
      status: AppointmentStatus.BOOKED,
    });

    return await this.appointmentRepository.save(appt);
  }

  findAll() {
    return `This action returns all appointment`;
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
}
