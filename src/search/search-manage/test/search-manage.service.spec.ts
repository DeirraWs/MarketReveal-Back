import { Test, TestingModule } from '@nestjs/testing';
import { SearchManageService } from '../search-manage.service';

describe('SearchManageService', () => {
  let service: SearchManageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SearchManageService],
    }).compile();

    service = module.get<SearchManageService>(SearchManageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
