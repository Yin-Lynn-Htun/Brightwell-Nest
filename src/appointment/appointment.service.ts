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
import { SlotStatus } from 'src/slot/entities/slot.entity';

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

  findAll() {
    return this.appointmentRepository.find({
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
}
