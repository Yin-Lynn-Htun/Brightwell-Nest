export const saltOrRounds = 10;

export enum DayOfWeek {
  SUNDAY = 'Sunday',
  MONDAY = 'Monday',
  TUESDAY = 'Tuesday',
  WEDNESDAY = 'Wednesday',
  THURSDAY = 'Thursday',
  FRIDAY = 'Friday',
  SATURDAY = 'Saturday',
}

export enum AppointmentStatus {
  BOOKED = 'Booked',
  CANCELED = 'Canceled',
}

export enum PurchaseStatus {
  ACTIVE = 'Active',
  EXPIRED = 'Expired',
  CANCELLED = 'Cancelled',
}

export enum InpatientStatus {
  REQUESTED = 'Requested',
  ADMITTED = 'Admitted',
  PENDING_DEPOSIT = 'Pending Deposit',
  IN_TREATMENT = 'Ongoing',
  DISCHARGED = 'Discharged',
  CANCELLED = 'Cancelled',
}

export const DayOfWeeks = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
