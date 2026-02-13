import { IsEnum, IsOptional } from 'class-validator';
import { CollectionType } from '../../../admin/collection/entities/collection.entity';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class FindPublicCollectionsDto extends PaginationQueryDto {
  @IsOptional()
  categoryId?: string;

  @IsOptional()
  @IsEnum(CollectionType)
  type?: CollectionType;
}
