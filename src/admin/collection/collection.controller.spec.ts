import { Test, TestingModule } from '@nestjs/testing';
import { CollectionController } from './collection.controller';
import { CollectionService } from './collection.service';
import { CollectionType, CollectionStatus } from './entities/collection.entity';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

describe('CollectionController', () => {
  let controller: CollectionController;
  let service: CollectionService;

  // ==========================================
  // Mock Service - จำลอง CollectionService
  // ==========================================
  const mockCollectionService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CollectionController],
      providers: [
        {
          provide: CollectionService,
          useValue: mockCollectionService,
        },
      ],
    }).compile();

    controller = module.get<CollectionController>(CollectionController);
    service = module.get<CollectionService>(CollectionService);

    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // ==========================================
  // Test Data
  // ==========================================
  const mockCollection = {
    id: 1,
    type: CollectionType.TOP_LIST,
    slug: 'top-5-laptop-for-work',
    titleTh: 'Top 5 Laptop สำหรับทำงาน',
    titleEn: 'Top 5 Laptop for Work',
    excerpt: 'รวมรุ่นน่าซื้อสำหรับสายทำงาน',
    coverImage: 'https://example.com/cover.jpg',
    categoryId: 'uuid-category-1',
    status: CollectionStatus.DRAFT,
    publishedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // ==========================================
  // CREATE Tests
  // ==========================================
  describe('create', () => {
    it('should create a new collection', async () => {
      const createDto: CreateCollectionDto = {
        type: CollectionType.TOP_LIST,
        slug: 'top-5-laptop-for-work',
        titleTh: 'Top 5 Laptop สำหรับทำงาน',
        titleEn: 'Top 5 Laptop for Work',
        excerpt: 'รวมรุ่นน่าซื้อสำหรับสายทำงาน',
      };

      mockCollectionService.create.mockResolvedValueOnce(mockCollection);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockCollection);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  // ==========================================
  // FIND ALL Tests
  // ==========================================
  describe('findAll', () => {
    it('should return all collections', async () => {
      const collections = [
        mockCollection,
        { ...mockCollection, id: 2, slug: 'another-collection' },
      ];
      mockCollectionService.findAll.mockResolvedValueOnce(collections);

      const result = await controller.findAll();

      expect(result).toEqual(collections);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  // ==========================================
  // FIND ONE Tests
  // ==========================================
  describe('findOne', () => {
    it('should return a collection by id', async () => {
      mockCollectionService.findOne.mockResolvedValueOnce(mockCollection);

      const result = await controller.findOne('1');

      expect(result).toEqual(mockCollection);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
  });

  // ==========================================
  // UPDATE Tests
  // ==========================================
  describe('update', () => {
    it('should update a collection', async () => {
      const updateDto: UpdateCollectionDto = {
        type: CollectionType.TOP_LIST,
        slug: 'top-5-laptop-for-work',
        titleTh: 'Updated Title',
      };
      const updatedCollection = { ...mockCollection, ...updateDto };
      mockCollectionService.update.mockResolvedValueOnce(updatedCollection);

      const result = await controller.update('1', updateDto);

      expect(result?.titleTh).toBe('Updated Title');
      expect(service.update).toHaveBeenCalledWith('1', updateDto);
    });
  });

  // ==========================================
  // REMOVE Tests
  // ==========================================
  describe('remove', () => {
    it('should remove a collection', async () => {
      mockCollectionService.remove.mockResolvedValueOnce(mockCollection);

      const result = await controller.remove('1');

      expect(result).toEqual(mockCollection);
      expect(service.remove).toHaveBeenCalledWith('1');
    });
  });
});
