import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CollectionItem } from './entities/collection-item.entity';
import { Collection } from '../collection/entities/collection.entity';
import { Product } from '../products/entities/product.entity';
import { CreateCollectionItemDto } from './dto/create-collection-item.dto';
import { UpdateCollectionItemDto } from './dto/update-collection-item.dto';
import {
  PaginationQueryDto,
  buildPaginationOptions,
  buildPaginationResult,
} from '../../common/dto/pagination-query.dto';

@Injectable()
export class CollectionItemService {
  constructor(
    @InjectRepository(CollectionItem)
    private readonly itemRepo: Repository<CollectionItem>,

    @InjectRepository(Collection)
    private readonly collectionRepo: Repository<Collection>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async create(dto: CreateCollectionItemDto) {
    // validate collection exists
    const collection = await this.collectionRepo.findOneBy({
      id: dto.collectionId,
    });
    if (!collection) {
      throw new NotFoundException('Collection not found');
    }

    // validate product exists
    const product = await this.productRepo.findOneBy({ id: dto.productId });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // check duplicate (collection + product must be unique)
    const existing = await this.itemRepo.findOneBy({
      collectionId: dto.collectionId,
      productId: dto.productId,
    });
    if (existing) {
      throw new ConflictException(
        'This product already exists in the collection',
      );
    }

    const item = this.itemRepo.create(dto);
    return this.itemRepo.save(item);
  }

  async findAll(query: PaginationQueryDto) {
    const { skip, page, limit } = buildPaginationOptions(query);

    const [items, total] = await this.itemRepo.findAndCount({
      order: { orderIndex: 'ASC', id: 'ASC' },
      skip,
      take: limit,
    });

    return buildPaginationResult({ items, total, page, limit });
  }

  async findOne(id: string) {
    const item = await this.itemRepo.findOne({
      where: { id },
      relations: ['product', 'collection'],
    });
    if (!item) {
      throw new NotFoundException('Collection item not found');
    }
    return item;
  }

  async update(id: string, dto: UpdateCollectionItemDto) {
    const item = await this.itemRepo.findOneBy({ id });
    if (!item) {
      throw new NotFoundException('Collection item not found');
    }

    await this.itemRepo.update(id, dto);
    return this.itemRepo.findOne({
      where: { id },
      relations: ['product'],
    });
  }

  async remove(id: string) {
    const item = await this.itemRepo.findOneBy({ id });
    if (!item) {
      throw new NotFoundException('Collection item not found');
    }

    await this.itemRepo.delete(id);
  }
}
