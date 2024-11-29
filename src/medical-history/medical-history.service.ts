import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMedicalHistoryDto } from './dto/create-medical-history.dto';
import { UpdateMedicalHistoryDto } from './dto/update-medical-history.dto';

import { MedicalHistory } from './entities/medical-history.entity';
import { Patient } from 'src/patients/entities/patient.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class MedicalHistoryService {
  constructor(
    @InjectRepository(MedicalHistory)
    private readonly medicalHistoryRepository: Repository<MedicalHistory>,
  ) {}

  async create(
    createMedicalHistoryDto: CreateMedicalHistoryDto,
    patient: Patient,
    user: User,
  ): Promise<MedicalHistory & { responseMessage: string }> {
    const medicalHistory = this.medicalHistoryRepository.create({
      ...createMedicalHistoryDto,
      patient,
      createdBy: user,
    });
    const data = await this.medicalHistoryRepository.save(medicalHistory);
    return {
      ...data,
      responseMessage: 'Medical history added successfully.',
    };
  }

  async findAll(): Promise<MedicalHistory[]> {
    return await this.medicalHistoryRepository.find({
      relations: ['patient', 'createdBy'],
    });
  }

  async findAllByPatient(patientId: number): Promise<MedicalHistory[]> {
    return await this.medicalHistoryRepository.find({
      where: {
        patient: {
          id: patientId,
        },
      },
      relations: ['patient', 'createdBy'],
    });
  }

  async findOne(id: number): Promise<MedicalHistory> {
    const medicalHistory = await this.medicalHistoryRepository.findOne({
      where: { id },
      relations: ['patient', 'createdBy'],
    });
    if (!medicalHistory) {
      throw new NotFoundException(`Medical history with ID ${id} not found`);
    }
    return medicalHistory;
  }

  async update(
    id: number,
    updateMedicalHistoryDto: UpdateMedicalHistoryDto,
  ): Promise<MedicalHistory> {
    const medicalHistory = await this.findOne(id);
    Object.assign(medicalHistory, updateMedicalHistoryDto);
    return await this.medicalHistoryRepository.save(medicalHistory);
  }

  async remove(id: number): Promise<void> {
    const medicalHistory = await this.findOne(id);
    await this.medicalHistoryRepository.remove(medicalHistory);
  }
}
