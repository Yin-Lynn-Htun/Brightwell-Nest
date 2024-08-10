import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DoctorExpService } from './doctor-exp.service';
import { CreateDoctorExpDto } from './dto/create-doctor-exp.dto';
import { UpdateDoctorExpDto } from './dto/update-doctor-exp.dto';

@Controller('doctor-exp')
export class DoctorExpController {
  constructor(private readonly doctorExpService: DoctorExpService) {}

  @Post()
  create(@Body() createDoctorExpDto: CreateDoctorExpDto) {
    return this.doctorExpService.create(createDoctorExpDto);
  }

  @Get()
  findAll() {
    return this.doctorExpService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doctorExpService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDoctorExpDto: UpdateDoctorExpDto) {
    return this.doctorExpService.update(+id, updateDoctorExpDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doctorExpService.remove(+id);
  }
}
