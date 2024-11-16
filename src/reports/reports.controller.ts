import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportService: ReportsService) {}

  @Get('monthly')
  async getMonthlyReport() {
    return await this.reportService.getMonthlyReport();
  }

  @Get('daily-transactions')
  async getDailyAppointmentTransactions() {
    return await this.reportService.getDailyTransactions();
  }

  @Get('/doctor-appointments')
  getDoctorAppointmentsReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.reportService.getDoctorAppointmentReport(
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

    return this.reportService.getDoctorSpecialityAppointmentReport(start, end);
  }

  @Get('/type-appointment')
  async getAppointmentTypeReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return this.reportService.getAppointmentTypeReport(start, end);
  }

  // New API for Appointment Transactions Report
  @Get('/appointment-transaction')
  async getAppointmentTransactionReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return this.reportService.getAppointmentTransactionReport(start, end);
  }

  @Get('package-purchase-count')
  getPackagePurchaseCount(
    @Query('startDate') start: string,
    @Query('endDate') end: string,
  ) {
    return this.reportService.getPackagePurchaseCount(start, end);
  }

  // Package Tag Name and Purchase Count
  @Get('package-tag-purchase-count')
  async getPackageTagPurchaseCount(
    @Query('startDate') start: string,
    @Query('endDate') end: string,
  ) {
    return this.reportService.getPackageTagPurchaseCount(start, end);
  }

  // Daily Package Transaction Report
  @Get('daily-package-transaction-report')
  async getDailyPackageTransactionReport(
    @Query('startDate') start: string,
    @Query('endDate') end: string,
  ) {
    return this.reportService.getDailyPackageTransactionReport(start, end);
  }

  @Get('patient-report')
  async getPatientReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.reportService.getPatientReport(startDate, endDate);
  }

  @Get('inpatient-report')
  async getInpatientReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.reportService.getInpatientReport(startDate, endDate);
  }
}
