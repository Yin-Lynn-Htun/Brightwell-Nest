import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSlotDto } from './dto/create-slot.dto';
import { UpdateSlotDto } from './dto/update-slot.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Slot } from './entities/slot.entity';
import { Repository } from 'typeorm';
import * as moment from 'moment';
import { AppointmentType } from 'src/constants';

@Injectable()
export class SlotService {
  constructor(
    @InjectRepository(Slot)
    private readonly slotRepository: Repository<Slot>,
  ) {}

  create(createSlotDto: CreateSlotDto) {
    return 'This action adds a new slot';
  }

  findAll() {
    return `This action returns all slot`;
  }

  async findOne(id: number) {
    return await this.slotRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, updateSlotDto: UpdateSlotDto) {
    const slot = await this.findOne(id);
    if (!slot) throw new NotFoundException('Slot not found!');

    Object.assign(slot, updateSlotDto);
    return await this.slotRepository.save(slot);
  }

  remove(id: number) {
    return `This action removes a #${id} slot`;
  }

  async generateSlotsForTwoWeeks(appointmentType: AppointmentType) {
    const slotsData = [];
    const startTime = '10:00';
    const endTime = '14:00';
    const slotDuration = 30; // 30 minutes

    // Current date
    let currentDate = moment(new Date()).startOf('day');

    let dateIdx = 0;
    // Loop for 14 days (2 weeks)
    for (let i = 0; i < 14; i++) {
      const daySlots = [];
      const dayStart = moment(currentDate).set({
        hour: 10,
        minute: 0,
        second: 0,
      });
      const dayEnd = moment(currentDate).set({
        hour: 14,
        minute: 0,
        second: 0,
      });

      let slotTime = dayStart.clone();

      let idx = 0;

      // Generate slots for the day
      while (slotTime.isBefore(dayEnd)) {
        const slotEndTime = slotTime.clone().add(slotDuration, 'minutes');

        // Check if the slot is already booked
        // const existingSlot = await this.slotRepository.findOne({
        //   where: {
        //     appointmentType: appointmentType,
        //     date: slotTime.toDate(), // Date without time
        //     timeSlot: slotTime.format('HH:mm:ss'), // Time of the slot
        //   },
        // });

        const existingSlot = undefined;

        const slot = {
          id: idx,
          // id: existingSlot ? existingSlot.id : null, // Use existing slot ID if available
          startTime: slotTime.format('HH:mm:ss'),
          endTime: slotEndTime.format('HH:mm:ss'),
          status: existingSlot ? 'Booked' : 'Available',
        };

        daySlots.push(slot);

        idx += 1;
        // Move to the next slot time
        slotTime.add(slotDuration, 'minutes');
      }

      // Store slots for the current day
      slotsData.push({
        id: dateIdx,
        date: currentDate.toISOString(),
        startTime: startTime + ':00',
        endTime: endTime + ':00',
        slots: daySlots,
      });

      // Move to the next day
      currentDate.add(1, 'day');
      dateIdx += 1;
    }

    return slotsData;
  }
}
