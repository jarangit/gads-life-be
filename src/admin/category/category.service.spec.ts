import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';
// import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';

describe('CategoryService', () => {
  let service: CategoryService;
  // let repository: Repository<Category>;

  // ============================================
  // Mock Repository - จำลอง database operations
  // ============================================
  const mockCategoryRepository = {
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
        CategoryService,
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoryRepository,
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    // repository = module.get<Repository<Category>>(getRepositoryToken(Category));

    // Reset mock ทุกครั้งก่อน test ใหม่
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ============================================
  // Test Cases สำหรับ create()
  // ============================================
  describe('create', () => {
    // ข้อมูลที่ใช้ test (เตรียมไว้ใช้ซ้ำ)
    const createDto: CreateCategoryDto = {
      slug: 'laptop',
      nameTh: 'แล็ปท็อป',
      nameEn: 'Laptop',
      description: 'รวมแล็ปท็อปทุกรุ่น',
      isActive: true,
      orderIndex: 1,
    };

    const savedCategory: Category = {
      id: 'uuid-1234-5678',
      slug: 'laptop',
      nameTh: 'แล็ปท็อป',
      nameEn: 'Laptop',
      description: 'รวมแล็ปท็อปทุกรุ่น',
      heroImage: null,
      isActive: true,
      orderIndex: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // ------------------------------------------
    // Test Case 1: สร้าง category สำเร็จ
    // ------------------------------------------
    it('should create a new category successfully', async () => {
      // Arrange (เตรียมข้อมูล)
      // - findOne return null = ไม่มี slug ซ้ำ
      mockCategoryRepository.findOne.mockResolvedValue(null);
      // - create return entity object
      mockCategoryRepository.create.mockReturnValue(savedCategory);
      // - save return entity ที่บันทึกแล้ว
      mockCategoryRepository.save.mockResolvedValue(savedCategory);

      // Act (เรียก function)
      const result = await service.create(createDto);

      // Assert (ตรวจสอบผลลัพธ์)
      // 1. ตรวจว่า findOne ถูกเรียกด้วย slug ที่ถูกต้อง
      expect(mockCategoryRepository.findOne).toHaveBeenCalledWith({
        where: { slug: 'laptop' },
      });
      // 2. ตรวจว่า create ถูกเรียกด้วย dto
      expect(mockCategoryRepository.create).toHaveBeenCalledWith(createDto);
      // 3. ตรวจว่า save ถูกเรียก
      expect(mockCategoryRepository.save).toHaveBeenCalled();
      // 4. ตรวจว่า return ค่าถูกต้อง
      expect(result).toEqual(savedCategory);
      expect(result.slug).toBe('laptop');
    });

    // ------------------------------------------
    // Test Case 2: slug ซ้ำ → throw error
    // ------------------------------------------
    it('should throw ConflictException when slug already exists', async () => {
      // Arrange
      // - findOne return category = มี slug ซ้ำแล้ว!
      mockCategoryRepository.findOne.mockResolvedValue(savedCategory);

      // Act & Assert
      // ใช้ rejects.toThrow สำหรับ async function ที่ throw error
      await expect(service.create(createDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.create(createDto)).rejects.toThrow(
        'Category with this slug already exists',
      );

      // ตรวจว่า create และ save ไม่ถูกเรียก (เพราะ throw ก่อน)
      expect(mockCategoryRepository.create).not.toHaveBeenCalled();
      expect(mockCategoryRepository.save).not.toHaveBeenCalled();
    });
  });
});
