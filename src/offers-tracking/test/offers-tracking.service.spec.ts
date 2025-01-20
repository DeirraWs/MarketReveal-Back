import { Test, TestingModule } from '@nestjs/testing';
import { OffersTrackingService } from '../offers-tracking.service';

describe('OffersTrackingService', () => {
  let service: OffersTrackingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OffersTrackingService],
    }).compile();

    service = module.get<OffersTrackingService>(OffersTrackingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
