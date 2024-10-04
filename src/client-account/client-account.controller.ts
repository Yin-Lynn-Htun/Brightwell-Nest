import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { ClientAccountService } from './client-account.service';
import { JwtAuthGuard } from 'src/client-auth/client-jwt.guard';
import { Request } from 'express';
import { PatientsService } from 'src/patients/patients.service';

@Controller('client-account')
export class ClientAccountController {
  constructor(
    private readonly clientAccountService: ClientAccountService,
    private readonly patientService: PatientsService,
  ) {}

  @Get('/profile')
  @UseGuards(JwtAuthGuard)
  profile(@Req() req: Request & { user: { id: number } }) {
    return this.patientService.findOne(req?.user?.id as number);
  }

  @Get('/appointments')
  @UseGuards(JwtAuthGuard)
  appointments(@Req() req: Request & { user: { id: number } }) {
    return this.clientAccountService.getAppointment(req.user.id);
  }

  @Get('/packages')
  @UseGuards(JwtAuthGuard)
  packages(@Req() req: Request & { user: { id: number } }) {
    return this.clientAccountService.getPackages(req.user.id);
  }

  @Get('/rooms')
  @UseGuards(JwtAuthGuard)
  rooms(@Req() req: Request & { user: { id: number } }) {
    return this.clientAccountService.getRooms(req.user.id);
  }

  // @Get('/transactions')
  // @UseGuards(JwtAuthGuard)
  // transactions(@Req() req: Request & { user: { id: number } }) {
  //   return this.clientAccountService.getTransactions(req.user.id);
  // }

  @Get('/pending-transactions')
  @UseGuards(JwtAuthGuard)
  transactions(@Req() req: Request & { user: { id: number } }) {
    return this.clientAccountService.getPendingTransactions(req.user.id);
  }

  @Get('/pending-deposits')
  @UseGuards(JwtAuthGuard)
  pendingDeposits(@Req() req: Request & { user: { id: number } }) {
    return this.clientAccountService.getPendingDeposits(req.user.id);
  }

  // @Get(':id/pending-deposits')
  // async getPendingDeposits(@Param('id', ParseIntPipe) patientId: number): Promise<Deposit[]> {
  //   return this.patientService.getPendingDeposits(patientId);
  // }

  // @Post()
  // create(@Body() createClientAccountDto: CreateClientAccountDto) {
  //   return this.clientAccountService.create(createClientAccountDto);
  // }
}
