import { Test, TestingModule } from '@nestjs/testing';
import { DoctorExpService } from './doctor-exp.service';

describe('DoctorExpService', () => {
  let service: DoctorExpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DoctorExpService],
    }).compile();

    service = module.get<DoctorExpService>(DoctorExpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
