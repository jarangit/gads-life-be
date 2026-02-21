import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../products/entities/product.entity';
import { Brand } from '../brands/entities/brand.entity';
import { Category } from '../category/entities/category.entity';
import { Collection } from '../collection/entities/collection.entity';

describe('ReportsService', () => {
  let service: ReportsService;

  const mockRepository = {
    count: jest.fn(),
    find: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(Brand),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(Category),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(Collection),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getDashboardSummary', () => {
    it('should return dashboard summary', async () => {
      mockRepository.count.mockResolvedValue(10);

      const result = await service.getDashboardSummary();

      expect(result).toHaveProperty('totalProducts');
      expect(result).toHaveProperty('totalBrands');
      expect(result).toHaveProperty('totalCategories');
      expect(result).toHaveProperty('totalCollections');
    });
  });
});
