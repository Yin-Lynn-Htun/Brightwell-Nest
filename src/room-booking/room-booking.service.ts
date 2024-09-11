import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { CreateRoomBookingDto } from './dto/create-room-booking.dto';
import { UpdateRoomBookingDto } from './dto/update-room-booking.dto';
import { JwtAuthGuard } from 'src/client-auth/client-jwt.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from 'src/room/entities/room.entity';
import { Repository } from 'typeorm';
import { PatientsService } from 'src/patients/patients.service';
import { RoomService } from 'src/room/room.service';
import { RoomBooking } from './entities/room-booking.entity';
import { RoomBookingStatus } from 'src/constants';

@Injectable()
export class RoomBookingService {
  constructor(
    @InjectRepository(RoomBooking)
    private readonly roomBookingRepository: Repository<RoomBooking>,
    private readonly patientService: PatientsService,
    private readonly roomService: RoomService,
  ) {}

  @UseGuards(JwtAuthGuard)
  async create(patientId: number, createRoomBookingDto: CreateRoomBookingDto) {
    const { roomId, startDate, endDate } = createRoomBookingDto;

    const patient = await this.patientService.findOne(patientId);
    if (!patient) throw new NotFoundException('User not found.');

    const room = await this.roomService.findOne(roomId);
    if (!room) throw new NotFoundException('Room not found.');

    // Check if room is already booked for the specified date range
    const overlappingBooking = await this.roomBookingRepository
      .createQueryBuilder('booking')
      .where('booking.roomId = :roomId', { roomId })
      .andWhere('booking.startDate < :endDate', { endDate })
      .andWhere('booking.endDate > :startDate', { startDate })
      .getOne();

    if (overlappingBooking) {
      throw new BadRequestException(
        'Room is already booked for the specified date range',
      );
    }

    // Create a new booking
    const roomBooking = this.roomBookingRepository.create({
      room,
      patient,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status: RoomBookingStatus.BOOKED,
    });

    return this.roomBookingRepository.save(roomBooking);
  }

  findAll() {
    return `This action returns all roomBooking`;
  }

  findOne(id: number) {
    return `This action returns a #${id} roomBooking`;
  }

  update(id: number, updateRoomBookingDto: UpdateRoomBookingDto) {
    return `This action updates a #${id} roomBooking`;
  }

  remove(id: number) {
    return `This action removes a #${id} roomBooking`;
  }
}
