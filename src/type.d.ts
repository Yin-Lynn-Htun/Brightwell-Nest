interface GroupedAppointment {
  date: string;
  appointments: {
    slot: Slot;
    doctor: Doctor;
    patient: Patient;
  }[];
}
