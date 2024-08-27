export class CreateScheduleDto {
  doctorId: string;
  startDate: string;

  shifts: {
    startTime: string;
    endTime: string;
    dayOfWeek: string;
    bookingLimit: number;
  }[];

  recurringType: string;
  recurringEndDate?: string;
  recurringCount?: string;
}
