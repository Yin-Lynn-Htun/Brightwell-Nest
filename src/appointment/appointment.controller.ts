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
  Query,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { JwtAuthGuard } from 'src/client-auth/client-jwt.guard';
import { Request } from 'express';

@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Req() req: Request & { user: { id: number } },
    @Body() createAppointmentDto: CreateAppointmentDto,
  ) {
    const patientId = req.user.id;
    return this.appointmentService.create({
      ...createAppointmentDto,
      patientId,
    });
  }

  @Get()
  async getAppointments(
    @Query('date') date?: string,
    @Query('doctorId') doctorIds?: string[],
  ) {
    const doctorIdArray =
      typeof doctorIds === 'string'
        ? [doctorIds]
        : doctorIds
          ? doctorIds.map((id) => parseInt(id, 10))
          : undefined;
    return this.appointmentService.getAppointments(date, doctorIdArray);
  }

  @Get('/recent')
  async getRecentAppointments() {
    return this.appointmentService.getRecentAppointments();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentService.update(+id, updateAppointmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentService.remove(+id);
  }
}
