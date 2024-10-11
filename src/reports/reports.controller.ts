import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('monthly')
  async getMonthlyReport() {
    return await this.reportsService.getMonthlyReport();
  }

  @Get('daily-transactions')
  async getDailyAppointmentTransactions() {
    return await this.reportsService.getDailyTransactions();
  }

  @Get('/doctor-appointments')
  getDoctorAppointmentsReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.reportsService.getDoctorAppointmentReport(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('/speciality-appointment')
  async getDoctorSpecialityReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return this.reportsService.getDoctorSpecialityAppointmentReport(start, end);
  }

  // New API for Appointment Transactions Report
  @Get('/appointment-transaction')
  async getAppointmentTransactionReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return this.reportsService.getAppointmentTransactionReport(start, end);
  }

  @Get()
  findAll() {
    return this.reportsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reportsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReportDto: UpdateReportDto) {
    return this.reportsService.update(+id, updateReportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reportsService.remove(+id);
  }
}
