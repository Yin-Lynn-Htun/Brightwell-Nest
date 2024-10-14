import { AppointmentType } from 'src/constants';

export class CreateAppointmentDto {
  slotId: number;
  // transcationId: string; later
}

export class CreateServiceAppointmentDto {
  medicalType: AppointmentType;
  date: string;
  startTime: string;
  endTime: string;
  allergy?: string;
  description?: string;
  attachments?: string[];
}
