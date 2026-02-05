import { Test, TestingModule } from '@nestjs/testing';
import { CollectionService } from './collection.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Collection, CollectionType } from './entities/collection.entity';

describe('CollectionService', () => {
  let service: CollectionService;

  const mockCollectionRepository = {
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
        CollectionService,
        {
          provide: getRepositoryToken(Collection),
          useValue: mockCollectionRepository,
        },
      ],
    }).compile();

    service = module.get<CollectionService>(CollectionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const dto = {
    type: CollectionType.TOP_LIST,
    slug: 'top-5-laptop-for-work-1',
    titleTh: 'Top 5 Laptop สำหรับทำงาน',
    titleEn: undefined,
    excerpt: 'รวมรุ่นน่าซื้อสำหรับสายทำงาน',
    coverImage: undefined,
    categoryId: 1,
    subcategoryId: 10,
  };

  it('should be created', async () => {
    // slug ไม่ซ้ำ
    mockCollectionRepository.findOne.mockResolvedValueOnce(null);
    const createEntity = {
      id: undefined,
      ...dto,
      status: 'DRAFT',
      publishedAt: null,
      createdAt: undefined,
      updatedAt: undefined,
      category: undefined,
    } as unknown as Collection;
    mockCollectionRepository.create.mockReturnValue(createEntity);

    // save entity have id
    const savedEntity = { ...createEntity, id: 1 } as Collection;
    mockCollectionRepository.save.mockResolvedValueOnce(savedEntity);

    const result = await service.create({
      ...dto,
    });
    expect(result).toEqual(savedEntity);
    expect(mockCollectionRepository.findOne).toHaveBeenCalledWith({
      where: { slug: dto.slug },
    });

    expect(result.id).toBe(1);
  });
});
