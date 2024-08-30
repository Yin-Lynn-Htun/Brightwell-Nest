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
} from '@nestjs/common';
import { ClientAccountService } from './client-account.service';
import { CreateClientAccountDto } from './dto/create-client-account.dto';
import { UpdateClientAccountDto } from './dto/update-client-account.dto';
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

  @Post()
  create(@Body() createClientAccountDto: CreateClientAccountDto) {
    return this.clientAccountService.create(createClientAccountDto);
  }

  @Get()
  findAll() {
    return this.clientAccountService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientAccountService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateClientAccountDto: UpdateClientAccountDto,
  ) {
    return this.clientAccountService.update(+id, updateClientAccountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientAccountService.remove(+id);
  }
}
