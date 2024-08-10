import { Test, TestingModule } from '@nestjs/testing';
import { DoctorExpController } from './doctor-exp.controller';
import { DoctorExpService } from './doctor-exp.service';

describe('DoctorExpController', () => {
  let controller: DoctorExpController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DoctorExpController],
      providers: [DoctorExpService],
    }).compile();

    controller = module.get<DoctorExpController>(DoctorExpController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
