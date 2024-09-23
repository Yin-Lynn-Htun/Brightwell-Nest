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
import { DepositService } from './deposit.service';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { UpdateDepositDto } from './dto/update-deposit.dto';
import { DepositStatus } from './entities/deposit.entity';
import { JwtAuthGuard } from 'src/client-auth/client-jwt.guard';

@Controller('deposit')
export class DepositController {
  constructor(private readonly depositService: DepositService) {}

  @Post()
  create(@Body() createDepositDto: CreateDepositDto) {
    return this.depositService.create(createDepositDto);
  }

  @Get()
  findAll() {
    return this.depositService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.depositService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDepositDto: UpdateDepositDto) {
    return this.depositService.update(+id, updateDepositDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/pay-deposit')
  payDeposit(
    @Req() req: Request & { user: { id: string } },
    @Param('id') depositId: string,
  ) {
    const patientId = +req.user?.id;
    return this.depositService.payDeposit(patientId, +depositId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.depositService.remove(+id);
  }
}
