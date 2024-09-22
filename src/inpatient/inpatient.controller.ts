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
import { InpatientService } from './inpatient.service';
import { AssignRoomDto, CreateInpatientDto } from './dto/create-inpatient.dto';
import { UpdateInpatientDto } from './dto/update-inpatient.dto';
import { JwtAuthGuard } from 'src/client-auth/client-jwt.guard';

@Controller('inpatient')
export class InpatientController {
  constructor(private readonly inpatientService: InpatientService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Req() req: Request & { user: { id: string } },
    @Body() createInpatientDto: CreateInpatientDto,
  ) {
    const patientId = +req.user?.id;
    return this.inpatientService.requestRoom(patientId, createInpatientDto);
  }

  @Get()
  findAll() {
    return this.inpatientService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inpatientService.findOne(+id);
  }

  @Patch(':id/assign-room')
  @UseGuards(JwtAuthGuard)
  assignRoom(@Param('id') id: string, @Body() assignRoomDto: AssignRoomDto) {
    return this.inpatientService.assignRoom(+id, assignRoomDto);
  }

  @Patch(':id/cancel-room')
  @UseGuards(JwtAuthGuard)
  confirmRoom(@Param('id') id: string) {
    return this.inpatientService.cancelRoom(+id);
  }

  @Patch(':id/pay-deposit')
  @UseGuards(JwtAuthGuard)
  payDeposit(@Param('id') id: string, @Body() assignRoomDto: AssignRoomDto) {
    return this.inpatientService.payDeposit(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInpatientDto: UpdateInpatientDto,
  ) {
    return this.inpatientService.update(+id, updateInpatientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inpatientService.remove(+id);
  }
}
