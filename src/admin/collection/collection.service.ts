import { ConflictException, Injectable } from '@nestjs/common';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Collection, CollectionStatus } from './entities/collection.entity';
import { Repository } from 'typeorm';
import { Category } from '../category/entities/category.entity';

@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async create(createCollectionDto: CreateCollectionDto) {
    const { slug, categoryId } = createCollectionDto;

    const hasCategory = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });
    if (!hasCategory) {
      throw new ConflictException('Category not found');
    }

    const existing: any = await this.collectionRepository.findOne({
      where: { slug },
    });
    if (existing) {
      throw new ConflictException('Collection with this slug already exists');
    }

    const collection = this.collectionRepository.create({
      ...createCollectionDto,
      status: CollectionStatus.DRAFT,
    });
    return await this.collectionRepository.save(collection);
  }

  findAll() {
    // element find all data
    const data = this.collectionRepository.find();
    return data;
  }

  findOne(id: string) {
    return `This action returns a #${id} collection`;
  }

  async update(id: string, updateCollectionDto: UpdateCollectionDto) {
    const find = await this.collectionRepository.findOneBy({ id });
    if (!find) {
      throw new ConflictException('Collection not found');
    }

    await this.collectionRepository.update(id, updateCollectionDto);
    return this.collectionRepository.findOneBy({ id });
  }

  async remove(id: string) {
    const collection = await this.collectionRepository.findOneBy({ id });
    if (!collection) {
      throw new ConflictException('Collection not found');
    }

    await this.collectionRepository.delete(id);
  }
}
