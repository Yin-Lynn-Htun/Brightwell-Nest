import { Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Appointment } from 'src/appointment/entities/appointment.entity';
import { Package } from 'src/package/entities/package.entity';
import { Inpatient } from 'src/inpatient/entities/inpatient.entity';

import {
  Transaction,
  TransactionStatus,
  TransactionType,
} from 'src/transaction/entities/transaction.entity';
import { Purchase } from 'src/purchase/entities/purchase.entity';
import * as moment from 'moment';
import { Doctor } from 'src/doctor/entities/doctor.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,

    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,

    @InjectRepository(Purchase)
    private purchaseRepository: Repository<Purchase>,

    @InjectRepository(Inpatient)
    private inpatientRepository: Repository<Inpatient>,

    @InjectRepository(Inpatient)
    private doctorRepository: Repository<Doctor>,
  ) {}

  async getMonthlyReport(): Promise<any> {
    const today = moment(new Date());
    const currentMonthStart = today.clone().subtract(1, 'month');
    const lastMonthStart = today.clone().subtract(2, 'month');

    // Current month period (last 30 days)
    const currentStartDate = currentMonthStart.toDate();
    const currentEndDate = today.toDate();

    // Previous month period
    const lastStartDate = lastMonthStart.toDate();
    const lastEndDate = currentMonthStart.toDate();

    // Fetch Data for Current and Last Month
    const currentRevenue = await this.transactionRepository
      .createQueryBuilder('transaction')
      .where('transaction.createdAt BETWEEN :start AND :end', {
        start: currentStartDate,
        end: currentEndDate,
      })
      .andWhere('transaction.status = :status', {
        status: TransactionStatus.SUCCESS,
      })
      .select('SUM(transaction.amount)', 'total')
      .getRawOne();

    const lastRevenue = await this.transactionRepository
      .createQueryBuilder('transaction')
      .where('transaction.createdAt BETWEEN :start AND :end', {
        start: lastStartDate,
        end: lastEndDate,
      })
      .andWhere('transaction.status = :status', {
        status: TransactionStatus.SUCCESS,
      })
      .select('SUM(transaction.amount)', 'total')
      .getRawOne();

    const currentAppointmentsCount = await this.appointmentRepository.count({
      where: { createdAt: Between(currentStartDate, currentEndDate) },
    });

    const lastAppointmentsCount = await this.appointmentRepository.count({
      where: { createdAt: Between(lastStartDate, lastEndDate) },
    });

    const currentPackagesCount = await this.purchaseRepository.count({
      where: { createdAt: Between(currentStartDate, currentEndDate) },
    });

    const lastPackagesCount = await this.purchaseRepository.count({
      where: { createdAt: Between(lastStartDate, lastEndDate) },
    });

    const currentInpatientsCount = await this.inpatientRepository.count({
      where: { createdAt: Between(currentStartDate, currentEndDate) },
    });

    const lastInpatientsCount = await this.inpatientRepository.count({
      where: { createdAt: Between(lastStartDate, lastEndDate) },
    });

    // Calculate Percentages
    const revenueChange = this.calculatePercentageChange(
      currentRevenue?.total,
      lastRevenue?.total ?? 0,
    );
    const appointmentsChange = this.calculatePercentageChange(
      currentAppointmentsCount,
      lastAppointmentsCount,
    );
    const packagesChange = this.calculatePercentageChange(
      currentPackagesCount,
      lastPackagesCount,
    );
    const inpatientsChange = this.calculatePercentageChange(
      currentInpatientsCount,
      lastInpatientsCount,
    );

    return {
      revenue: {
        count: (+currentRevenue?.total).toFixed(2) || 0,
        percentage: revenueChange,
      },
      appointments: {
        count: currentAppointmentsCount,
        percentage: appointmentsChange,
      },
      packages: {
        count: currentPackagesCount,
        percentage: packagesChange,
      },
      inpatients: {
        count: currentInpatientsCount,
        percentage: inpatientsChange,
      },
    };
  }

  // Combined method to get daily transactions for both appointments and packages
  async getDailyTransactions(): Promise<any[]> {
    const today = moment();
    const currentMonthStart = today.clone().subtract(1, 'month').toDate();
    const currentEndDate = today.toDate();

    // Get appointment transactions
    const appointments = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select('DATE(transaction.createdAt) as date')
      .addSelect('SUM(transaction.amount) as amount')
      .where('transaction.createdAt BETWEEN :start AND :end', {
        start: currentMonthStart,
        end: currentEndDate,
      })
      .andWhere('transaction.type = :type', {
        type: TransactionType.APPOINTMENT,
      }) // Appointment transactions
      .andWhere('transaction.status = :status', {
        status: TransactionStatus.SUCCESS,
      })
      .groupBy('DATE(transaction.createdAt)')
      .orderBy('DATE(transaction.createdAt)', 'ASC')
      .getRawMany();

    // Get package purchase transactions
    const packages = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select('DATE(transaction.createdAt) as date')
      .addSelect('SUM(transaction.amount) as amount')
      .where('transaction.createdAt BETWEEN :start AND :end', {
        start: currentMonthStart,
        end: currentEndDate,
      })
      .andWhere('transaction.type = :type', { type: TransactionType.PACKAGE }) // Package purchase transactions
      .andWhere('transaction.status = :status', {
        status: TransactionStatus.SUCCESS,
      })
      .groupBy('DATE(transaction.createdAt)')
      .orderBy('DATE(transaction.createdAt)', 'ASC')
      .getRawMany();

    // Create a map of appointment transactions
    const appointmentMap = appointments.reduce((acc, record) => {
      acc[moment(record.date).format('YYYY-MM-DD')] = Number(record.amount);
      return acc;
    }, {});

    // Create a map of package transactions
    const packageMap = packages.reduce((acc, record) => {
      acc[moment(record.date).format('YYYY-MM-DD')] = Number(record.amount);
      return acc;
    }, {});

    // Generate an array of all dates in the range
    const allDates = [];
    let currentDate = moment(currentMonthStart);

    while (currentDate.isSameOrBefore(today)) {
      allDates.push(currentDate.clone().format('YYYY-MM-DD'));
      currentDate.add(1, 'day');
    }

    // Build the final result, including both appointments and packages
    const formattedResult = allDates.map((date) => ({
      date: moment(date).format('DD/MM/YYYY'),
      appointmentAmount: appointmentMap[date] || 0,
      packageAmount: packageMap[date] || 0,
    }));

    return formattedResult;
  }

  async getDoctorAppointmentReport(startDate: Date, endDate: Date) {
    const result = await this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoin('appointment.slot', 'slot')
      .leftJoin('slot.schedule', 'schedule')
      .leftJoin('schedule.doctor', 'doctor')
      .leftJoin('doctor.user', 'user') // Assuming that User has firstName and lastName
      .select(
        `CONCAT(user.firstName, ' ', user.lastName)`,
        'doctor', // Concatenating first and last name
      )
      .addSelect('COUNT(appointment.id)', 'bookings')
      .where('appointment.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .groupBy('user.firstName')
      .addGroupBy('user.lastName')
      .getRawMany();

    return result;
  }

  async getDoctorSpecialityAppointmentReport(startDate: Date, endDate: Date) {
    const result = await this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoin('appointment.slot', 'slot')
      .leftJoin('slot.schedule', 'schedule')
      .leftJoin('schedule.doctor', 'doctor')
      .leftJoin('doctor.specialties', 'speciality')
      .select('speciality.name', 'speciality')
      .addSelect('COUNT(appointment.id)', 'bookings')
      .where('appointment.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .groupBy('speciality.name')
      .getRawMany();

    return result;
  }

  async getAppointmentTransactionReport(startDate: Date, endDate: Date) {
    // Query for appointment transactions within the date range
    const transactions = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select('DATE(transaction.createdAt)', 'date')
      .addSelect('SUM(transaction.amount)', 'totalAmount')
      .where('transaction.type = :type', { type: TransactionType.APPOINTMENT })
      .andWhere('transaction.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .groupBy('DATE(transaction.createdAt)')
      .orderBy('DATE(transaction.createdAt)', 'ASC')
      .getRawMany();

    // Convert transactions into a map for easy lookup
    const transactionMap = transactions.reduce((map, item) => {
      map[moment(item.date).format('YYYY-MM-DD')] = parseFloat(
        item.totalAmount,
      ).toFixed(2);
      return map;
    }, {});

    console.log(transactionMap, 'transactionMap');

    // Generate all dates between startDate and endDate
    const currentDate = moment(startDate);
    const end = moment(endDate);
    const result = [];

    while (currentDate.isSameOrBefore(end)) {
      const formattedDate = currentDate.format('YYYY-MM-DD');
      result.push({
        date: formattedDate,
        totalAmount: transactionMap[formattedDate] || '0.00', // If no transaction, set to 0
      });
      currentDate.add(1, 'day'); // Move to the next day
    }

    return result;
  }

  // Helper function to calculate percentage change
  private calculatePercentageChange(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  }

  async getPackagePurchaseCount(start: string, end: string) {
    console.log('here');
    const query = this.purchaseRepository
      .createQueryBuilder('purchase')
      .select('package.name', 'packageName')
      .addSelect('COUNT(purchase.id)', 'purchaseCount')
      .innerJoin('purchase.package', 'package')
      .where(
        'DATE(purchase.createdAt) >= :start AND DATE(purchase.createdAt) <= :end',
        { start, end },
      )
      .groupBy('package.name');

    return await query.getRawMany();
  }

  async getPackageTagPurchaseCount(start: string, end: string) {
    const query = this.purchaseRepository
      .createQueryBuilder('purchase')
      .select('tag.name', 'tag')
      .addSelect('COUNT(purchase.id)', 'purchaseCount')
      .innerJoin('purchase.package', 'package')
      .innerJoin('package.tags', 'tag')
      .where(
        'DATE(purchase.createdAt) >= :start AND DATE(purchase.createdAt) <= :end',
        { start, end },
      )
      .groupBy('tag.name');

    return await query.getRawMany();
  }

  async getDailyPackageTransactionReport($start: string, $end: string) {
    const start = new Date($start);
    const end = new Date($end);
    end.setHours(24, 0, 0, 0);

    const query = this.transactionRepository
      .createQueryBuilder('transaction')
      .select('DATE(transaction.createdAt)', 'date')
      .addSelect('SUM(transaction.amount)', 'totalAmount')
      .where('transaction.type = :type', { type: TransactionType.PACKAGE })
      // Use BETWEEN to ensure the query is inclusive of both start and end date
      .andWhere('DATE(transaction.createdAt) BETWEEN :start AND :end', {
        start,
        end,
      })
      .groupBy('DATE(transaction.createdAt)')
      .orderBy('DATE(transaction.createdAt)', 'ASC');

    const result = await query.getRawMany();

    const dateMap = new Map<string, number>();

    result.forEach((r) => {
      const localDate = new Date(r.date).toISOString().split('T')[0]; // Handle timezone issues
      dateMap.set(localDate, +parseFloat(r.totalAmount).toFixed(2));
    });

    const dailyReport = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      dailyReport.push({
        date: dateStr,
        totalAmount: dateMap.get(dateStr) || 0,
      });
    }

    return dailyReport;
  }
}
