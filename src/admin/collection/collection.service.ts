import { ConflictException, Injectable } from '@nestjs/common';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Collection, CollectionStatus } from './entities/collection.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,
  ) {}
  async create(createCollectionDto: CreateCollectionDto) {
    const { slug, categoryId } = createCollectionDto;

    const hasCategory = await this.collectionRepository.findOne({
      where: { categoryId },
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

  findOne(id: number) {
    return `This action returns a #${id} collection`;
  }

  update(id: number, updateCollectionDto: UpdateCollectionDto) {
    return `This action updates a #${id} collection`;
  }

  remove(id: number) {
    return `This action removes a #${id} collection`;
  }
}
