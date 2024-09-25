import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSlotDto } from './dto/create-slot.dto';
import { UpdateSlotDto } from './dto/update-slot.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Slot } from './entities/slot.entity';
import { Repository } from 'typeorm';

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
    console.log('here');
    return await this.slotRepository.save(slot);
  }

  remove(id: number) {
    return `This action removes a #${id} slot`;
  }
}
