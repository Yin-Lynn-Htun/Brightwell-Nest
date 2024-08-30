import { Injectable } from '@nestjs/common';
import { CreateClientAccountDto } from './dto/create-client-account.dto';
import { UpdateClientAccountDto } from './dto/update-client-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from 'src/patients/entities/patient.entity';
import { Repository } from 'typeorm';
import * as moment from 'moment';
import { AppointmentStatus } from 'src/constants';

@Injectable()
export class ClientAccountService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientsRespository: Repository<Patient>,
  ) {}

  async getAppointment(id: number) {
    const patient = await this.patientsRespository.findOne({
      where: {
        id,
      },
      relations: [
        'appointments',
        'appointments.schedule',
        'appointments.schedule.doctor',
        'appointments.schedule.doctor.user',
        'appointments.schedule.doctor.specialties',
      ],
    });

    // console.log(patient);
    // return patient;

    const groupedAppointments = patient?.appointments.reduce(
      (acc, appointment) => {
        const scheduleDate = moment(appointment.schedule.date).format(
          'ddd, DD MMM YYYY',
        );

        // Check if this date already exists in the accumulator
        const existingGroup = acc.find((group) => group.date === scheduleDate);

        const appointmentDetails = {
          doctorName:
            appointment.schedule.doctor.user.firstName +
            ' ' +
            appointment.schedule.doctor.user.lastName,
          specialties: appointment.schedule.doctor.specialties
            .map((s) => s.name)
            .join(', '),
          time: `${moment(appointment.schedule.startTime, 'HH:mm:ss').format('hh:mm A')} - ${moment(appointment.schedule.endTime, 'HH:mm:ss').format('hh:mm A')}`,
          status: appointment.status,
        };

        if (existingGroup) {
          existingGroup.appointments.push(appointmentDetails);
        } else {
          acc.push({
            appointments: [appointmentDetails],
            date: scheduleDate,
          });
        }

        return acc;
      },
      [] as Array<{
        date: string;
        appointments: {
          doctorName: string;
          specialties: string;
          time: string;
          status: AppointmentStatus;
        }[];
      }>,
    );

    return groupedAppointments;
  }

  create(createClientAccountDto: CreateClientAccountDto) {
    return 'This action adds a new clientAccount';
  }

  findAll() {
    return `This action returns all clientAccount`;
  }

  findOne(id: number) {
    return `This action returns a #${id} clientAccount`;
  }

  update(id: number, updateClientAccountDto: UpdateClientAccountDto) {
    return `This action updates a #${id} clientAccount`;
  }

  remove(id: number) {
    return `This action removes a #${id} clientAccount`;
  }
}
