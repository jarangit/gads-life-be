import { ConflictException, Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
  ) {}

  async create(createBrandDto: CreateBrandDto) {
    const existing = await this.brandRepository.findOne({
      where: { slug: createBrandDto.slug },
    });
    if (existing) {
      throw new ConflictException('Brand with this slug already exists');
    }

    const brand = this.brandRepository.create(createBrandDto);
    return this.brandRepository.save(brand);
  }

  async findAll() {
    const data = await this.brandRepository.find();
    const res = {
      items: data,
      total: data.length,
    };
    return res;
  }

  findOne(id: string) {
    const data = this.brandRepository.findOneBy({ id: id });
    return data;
  }

  async update(id: string, updateBrandDto: UpdateBrandDto) {
    const find = await this.brandRepository.findOneBy({ id });
    if (!find) {
      throw new ConflictException('Brand not found');
    }
    await this.brandRepository.update(id, updateBrandDto);
    return this.brandRepository.findOneBy({ id });
  }

  remove(id: string) {
    return this.brandRepository.delete(id);
  }
}
