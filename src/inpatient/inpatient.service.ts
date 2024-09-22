import { Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { CreateInpatientDto, AssignRoomDto } from './dto/create-inpatient.dto';
import { UpdateInpatientDto } from './dto/update-inpatient.dto';
import { JwtAuthGuard } from 'src/client-auth/client-jwt.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Inpatient } from './entities/inpatient.entity';
import { Repository } from 'typeorm';
import { PatientsService } from 'src/patients/patients.service';
import { RoomTypeService } from 'src/room-type/room-type.service';
import { InpatientStatus } from 'src/constants';
import { RoomService } from 'src/room/room.service';
import { RoomStatus } from 'src/room/entities/room.entity';
import { TransactionService } from 'src/transaction/transaction.service';
import { TransactionType } from 'src/transaction/entities/transaction.entity';

@Injectable()
export class InpatientService {
  constructor(
    @InjectRepository(Inpatient)
    private readonly inpatientRepository: Repository<Inpatient>,
    private readonly patientService: PatientsService,
    private readonly roomTypeService: RoomTypeService,
    private readonly roomService: RoomService,
    private readonly transactionService: TransactionService,
  ) {}

  @UseGuards(JwtAuthGuard)
  async requestRoom(patientId: number, createInpatientDto: CreateInpatientDto) {
    const { roomTypeId, startDate } = createInpatientDto;

    const patient = await this.patientService.findOne(patientId);
    if (!patient) throw new NotFoundException('User not found.');

    const roomType = await this.roomTypeService.findOne(roomTypeId);
    if (!roomType) throw new NotFoundException('Room type not found.');

    // Create a new booking
    const inpatient = this.inpatientRepository.create({
      roomType,
      patient,
      startDate: new Date(startDate),
      status: InpatientStatus.REQUESTED,
    });

    return this.inpatientRepository.save(inpatient);
  }

  @UseGuards(JwtAuthGuard)
  async cancelRoom(inpatientId: number) {
    const inpatient = await this.findOne(inpatientId);
    if (!inpatient) throw new NotFoundException('Inpatient not found!');

    if (!inpatient.room) throw new NotFoundException('Room not found!');

    inpatient.status = InpatientStatus.CANCELLED;
    inpatient.room.status = RoomStatus.Available;

    await this.roomService.update(inpatient.room.id, {
      status: RoomStatus.Available,
    });

    await this.inpatientRepository.save(inpatient);
  }

  @UseGuards(JwtAuthGuard)
  async payDeposit(inpatientId: number) {
    const inpatient = await this.findOne(inpatientId);
    if (!inpatient) throw new NotFoundException('Inpatient not found!');

    await this.transactionService.create(inpatient.patient.id, {
      amount: 1000,
      referenceId: inpatient.id,
      type: TransactionType.INPATIENT,
    });

    inpatient.status = InpatientStatus.ADMITTED;
    await this.inpatientRepository.save(inpatient);
  }

  async findAll() {
    return this.inpatientRepository.find({
      relations: ['patient', 'roomType', 'room'],
    });
  }

  async findOne(id: number) {
    return this.inpatientRepository.findOne({
      where: {
        id,
      },
      relations: ['patient', 'roomType', 'room'],
    });
  }

  @UseGuards(JwtAuthGuard)
  async assignRoom(inpatientId: number, assignRoomDto: AssignRoomDto) {
    const { roomId } = assignRoomDto;

    const inpatient = await this.findOne(inpatientId);
    if (!inpatient) throw new NotFoundException('Inpatient not found!');

    const room = await this.roomService.update(roomId, {
      status: RoomStatus.Occupied,
    });

    inpatient.room = room;
    inpatient.status = InpatientStatus.PENDING_DEPOSIT;

    return this.inpatientRepository.save(inpatient);
  }

  update(id: number, updateInpatientDto: UpdateInpatientDto) {
    return `This action updates a #${id} inpatient`;
  }

  remove(id: number) {
    return `This action removes a #${id} inpatient`;
  }
}
