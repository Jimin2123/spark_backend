import { Test, TestingModule } from '@nestjs/testing';
import { RestrictionService } from './restriction.service';

describe('RestrictionService', () => {
  let service: RestrictionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RestrictionService],
    }).compile();

    service = module.get<RestrictionService>(RestrictionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
