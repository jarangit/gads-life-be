import { ConflictException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const existing = await this.categoryRepository.findOne({
      where: { slug: createCategoryDto.slug },
    });
    if (existing) {
      throw new ConflictException('Category with this slug already exists');
    }

    const category = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(category);
  }

  findAll() {
    // TODO: Implement findAll method
    const data = this.categoryRepository.find();
    return data;
  }

  findOne(slug: string) {
    const data = this.categoryRepository.findOneBy({ slug });
    return data;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const find = await this.categoryRepository.findOneBy({ id });
    if (!find) {
      throw new ConflictException('Category not found');
    }
    await this.categoryRepository.update(id, updateCategoryDto);
    return this.categoryRepository.findOneBy({ id });
  }

  remove(id: string) {
    return this.categoryRepository.delete(id);
  }
}
