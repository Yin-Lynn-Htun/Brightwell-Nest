import { Injectable } from '@nestjs/common';
import { CreateClientAccountDto } from './dto/create-client-account.dto';
import { UpdateClientAccountDto } from './dto/update-client-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from 'src/patients/entities/patient.entity';
import { Repository } from 'typeorm';
import * as moment from 'moment';
import { AppointmentStatus } from 'src/constants';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { TransactionService } from 'src/transaction/transaction.service';

@Injectable()
export class ClientAccountService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientsRespository: Repository<Patient>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async getAppointment(id: number) {
    const patient = await this.patientsRespository.findOne({
      where: {
        id,
      },
      relations: [
        'appointments',
        'appointments.slot',
        'appointments.slot.schedule.doctor',
        'appointments.slot.schedule.doctor.user',
        'appointments.slot.schedule.doctor.specialties',
      ],
    });

    const groupedAppointments =
      patient?.appointments.reduce(
        (acc, appointment) => {
          const scheduleDate = moment(appointment.slot.schedule.date).format(
            'ddd, DD MMM YYYY',
          );

          // Check if this date already exists in the accumulator
          const existingGroup = acc.find(
            (group) => group.date === scheduleDate,
          );

          const appointmentDetails = {
            doctorName:
              appointment.slot.schedule.doctor.user.firstName +
              ' ' +
              appointment.slot.schedule.doctor.user.lastName,
            specialties: appointment.slot.schedule.doctor.specialties
              .map((s) => s.name)
              .join(', '),
            time: `${moment(appointment.slot.startTime, 'HH:mm:ss').format('hh:mm A')} - ${moment(appointment.slot.endTime, 'HH:mm:ss').format('hh:mm A')}`,
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
      ) ?? [];

    groupedAppointments.sort((a, b) => moment(b.date).diff(moment(a.date)));

    return groupedAppointments;
  }

  async getPackages(patientId: number) {
    const data = await this.patientsRespository.findOne({
      where: {
        id: patientId,
      },
      relations: ['purchases', 'purchases.package'],
    });

    return data?.purchases ?? [];
  }

  async getRooms(patientId: number) {
    const data = await this.patientsRespository.findOne({
      where: {
        id: patientId,
      },
      relations: [
        'inpatients',
        'inpatients.room',
        'inpatients.roomType',
        'inpatients.deposits',
      ],
    });

    return data?.inpatients ?? [];
  }

  async getTransactions(patientId: number) {
    const data = await this.transactionRepository.find({
      where: {
        patient: {
          id: patientId,
        },
      },
      order: {
        id: 'DESC',
      },
    });

    return data ?? [];
  }
}
