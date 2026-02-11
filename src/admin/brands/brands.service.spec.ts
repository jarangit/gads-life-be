import { Test, TestingModule } from '@nestjs/testing';
import { BrandsService } from './brands.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';

describe('BrandsService', () => {
  let service: BrandsService;

  const mockBrandRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BrandsService,
        {
          provide: getRepositoryToken(Brand),
          useValue: mockBrandRepository,
        },
      ],
    }).compile();

    service = module.get<BrandsService>(BrandsService);
    // Reset mock ทุกครั้งก่อน test ใหม่
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
