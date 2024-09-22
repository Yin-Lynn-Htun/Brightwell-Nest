import { Test, TestingModule } from '@nestjs/testing';
import { InpatientChargeController } from './inpatient-charge.controller';
import { InpatientChargeService } from './inpatient-charge.service';

describe('InpatientChargeController', () => {
  let controller: InpatientChargeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InpatientChargeController],
      providers: [InpatientChargeService],
    }).compile();

    controller = module.get<InpatientChargeController>(InpatientChargeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
