import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DoctorEduService } from './doctor-edu.service';
import { CreateDoctorEduDto } from './dto/create-doctor-edu.dto';
import { UpdateDoctorEduDto } from './dto/update-doctor-edu.dto';

@Controller('doctor-edu')
export class DoctorEduController {
  constructor(private readonly doctorEduService: DoctorEduService) {}

  @Post()
  create(@Body() createDoctorEduDto: CreateDoctorEduDto) {
    return this.doctorEduService.create(createDoctorEduDto);
  }

  @Get()
  findAll() {
    return this.doctorEduService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doctorEduService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDoctorEduDto: UpdateDoctorEduDto) {
    return this.doctorEduService.update(+id, updateDoctorEduDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doctorEduService.remove(+id);
  }
}
