import { Injectable } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Doctor } from './entities/doctor.entity';
import { In, Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { DoctorEduService } from 'src/doctor-edu/doctor-edu.service';
import { CreateDoctorEduDto } from 'src/doctor-edu/dto/create-doctor-edu.dto';
import { SpecialitiesService } from 'src/specialities/specialities.service';
import { Speciality } from 'src/specialities/entities/speciality.entity';

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
    console.log(createDoctorDto);

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
    });

    const doc = await this.doctorRespository.create({
      ...createDoctorDto,
      specialties: specialityEntities,
      user,
      // educations: eduList,
    });

    return await this.doctorRespository.save(doc);
  }

  async findAll() {
    const doctors = await this.doctorRespository.find({
      relations: {
        user: true,
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

  findOne(id: number) {
    return `This action returns a #${id} doctor`;
  }

  update(id: number, updateDoctorDto: UpdateDoctorDto) {
    return `This action updates a #${id} doctor`;
  }

  remove(id: number) {
    return `This action removes a #${id} doctor`;
  }
}
