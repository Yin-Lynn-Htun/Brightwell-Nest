import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InpatientChargeService } from './inpatient-charge.service';
import { CreateInpatientChargeDto } from './dto/create-inpatient-charge.dto';
import { UpdateInpatientChargeDto } from './dto/update-inpatient-charge.dto';

@Controller('inpatient-charge')
export class InpatientChargeController {
  constructor(private readonly inpatientChargeService: InpatientChargeService) {}

  @Post()
  create(@Body() createInpatientChargeDto: CreateInpatientChargeDto) {
    return this.inpatientChargeService.create(createInpatientChargeDto);
  }

  @Get()
  findAll() {
    return this.inpatientChargeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inpatientChargeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInpatientChargeDto: UpdateInpatientChargeDto) {
    return this.inpatientChargeService.update(+id, updateInpatientChargeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inpatientChargeService.remove(+id);
  }
}
