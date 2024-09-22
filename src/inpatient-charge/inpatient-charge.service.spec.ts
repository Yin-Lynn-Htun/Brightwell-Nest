import { Test, TestingModule } from '@nestjs/testing';
import { InpatientChargeService } from './inpatient-charge.service';

describe('InpatientChargeService', () => {
  let service: InpatientChargeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InpatientChargeService],
    }).compile();

    service = module.get<InpatientChargeService>(InpatientChargeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
