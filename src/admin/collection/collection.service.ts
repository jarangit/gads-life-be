import { Injectable } from '@nestjs/common';
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
    const { slug } = createCollectionDto;
    const existing: any = await this.collectionRepository.findOne({
      where: { slug },
    });
    if (existing) {
      throw new Error('Collection with this slug already exists');
    }
    const collection = this.collectionRepository.create({
      ...createCollectionDto,
      status: CollectionStatus.DRAFT,
    });
    return this.collectionRepository.save(collection);
  }

  findAll() {
    return `This action returns all collection`;
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
