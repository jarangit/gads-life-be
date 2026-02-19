import { IsEnum, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export enum ProductStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

export class FindProductQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @IsOptional()
  categoryId?: string;

  @IsOptional()
  brandId?: string;

}
