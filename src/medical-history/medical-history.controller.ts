import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { MedicalHistoryService } from './medical-history.service';
import { CreateMedicalHistoryDto } from './dto/create-medical-history.dto';
import { UpdateMedicalHistoryDto } from './dto/update-medical-history.dto';
import { JwtAdminGuard } from 'src/auth/jwt.guard';
import { PatientsService } from 'src/patients/patients.service';
import { UserService } from 'src/user/user.service';

@Controller('medical-history')
export class MedicalHistoryController {
  constructor(
    private readonly medicalHistoryService: MedicalHistoryService,
    private readonly patientService: PatientsService, // Assuming there's a service for Patient entity
    private readonly userService: UserService,
  ) {}

  @Post(':patientId')
  @UseGuards(JwtAdminGuard)
  async create(
    @Param('patientId') patientId: number,
    @Body() createMedicalHistoryDto: CreateMedicalHistoryDto,
    @Req() req: Request & { user: { userId: number } }, // Getting authenticated user from the request
  ) {
    // Fetch the patient by patientId
    const patient = await this.patientService.findOne(patientId);
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${patientId} not found`);
    }
    const user = await this.userService.findOneWithoutUser(req.user.userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${req.user.userId} not found`);
    }

    // Pass patient and user along with the DTO to the service
    return this.medicalHistoryService.create(
      createMedicalHistoryDto,
      patient,
      user,
    );
  }

  @Get('/patient/:patientId')
  async findAllByPatient(@Param('patientId') patientId: number) {
    return this.medicalHistoryService.findAllByPatient(patientId);
  }

  @Get()
  findAll() {
    return this.medicalHistoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medicalHistoryService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMedicalHistoryDto: UpdateMedicalHistoryDto,
  ) {
    return this.medicalHistoryService.update(+id, updateMedicalHistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medicalHistoryService.remove(+id);
  }
}
