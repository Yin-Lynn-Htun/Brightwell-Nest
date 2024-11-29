import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DoctorEduService } from 'src/doctor-edu/doctor-edu.service';
import { SpecialitiesService } from 'src/specialities/specialities.service';
import { Role } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { Doctor } from './entities/doctor.entity';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRespository: Repository<Doctor>,
    private readonly userRespository: UserService,
    private readonly docEduRespository: DoctorEduService,
    private readonly specialityRepository: SpecialitiesService,
  ) {}

  async create(createDoctorDto: CreateDoctorDto) {
    const { educations, specialties } = createDoctorDto;

    const eduList: any = [];

    educations.forEach(async (item) => {
      const edu = await this.docEduRespository.create(item);
      eduList.push(edu);
    });

    // Fetch the specialties based on the IDs provided
    const specialityEntities = await this.specialityRepository.findByIds(
      specialties.map((s) => +s),
    );

    const user = await this.userRespository.create({
      ...createDoctorDto,
      role: Role.Doctor,
    });

    const doc = this.doctorRespository.create({
      ...createDoctorDto,
      specialties: specialityEntities,
      user,
      educations: eduList,
    });

    const data = await this.doctorRespository.save(doc);
    return { ...data, responseMessage: 'Doctor is created successfully!' };
  }

  async findAll() {
    const doctors = await this.doctorRespository.find({
      relations: {
        user: true,
        specialties: true,
      },
    });

    const transformedStaffMembers = doctors.map((doc) => {
      const temp = {
        ...doc,
        ...doc.user,
      };

      // @ts-ignore
      delete temp.user;

      return temp;
    });

    return transformedStaffMembers;
  }

  async findOne(id: number) {
    const doctor = await this.doctorRespository.findOne({
      where: { doctorId: id },
      relations: {
        user: true,
        specialties: true,
        educations: true,
      },
    });

    return doctor;
  }

  // Method to find doctor by userId
  async findByUserId(userId: number): Promise<Doctor> {
    const doctor = await this.doctorRespository.findOne({
      where: {
        user: { userId: userId }, // Query by userId
      },
      relations: ['user'],
    });

    if (!doctor) {
      throw new NotFoundException(`Doctor with user ID ${userId} not found`);
    }

    return doctor;
  }

  async update(doctorId: number, updateDoctorDto: UpdateDoctorDto) {
    // Fetch the doctor with the associated user
    const doctor = await this.doctorRespository.findOne({
      where: { doctorId },
      relations: ['user'],
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const items = updateDoctorDto.specialties ?? [];

    const eduList: any = [];
    const educations = updateDoctorDto.educations ?? [];

    // Fetch the specialties based on the IDs provided
    const specialties = await this.specialityRepository.findByIds(
      items.map((s) => +s),
    );

    for (const item of educations) {
      const edu = await this.docEduRespository.create(item);
      eduList.push(edu);
    }

    // Update the Doctor entity fields
    Object.assign(doctor, {
      ...updateDoctorDto,
      specialties,
      educations: eduList,
    }); // Save the updated Doctor entity
    await this.doctorRespository.save(doctor);

    await this.userRespository.update(doctor.user.userId, updateDoctorDto);
    return { doctor, responseMessage: 'Doctor is updated successfully!' };
  }

  async remove(id: number) {
    const doctor = await this.findOne(id);

    if (!doctor) {
      throw new NotFoundException();
    }

    const deletedDoctor = await this.doctorRespository.remove(doctor);

    if (doctor?.user?.userId) {
      this.userRespository.remove(doctor?.user.userId);
    }

    return {
      ...deletedDoctor,
      responseMessage: 'Deleted doctor successfully.',
    };
  }
}
