import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export const PUBLIC_PRODUCT_SORT_VALUES = [
  'latest',
  'priceAsc',
  'priceDesc',
  'scoreDesc',
] as const;

export type PublicProductSort = (typeof PUBLIC_PRODUCT_SORT_VALUES)[number];

export class FindPublicProductsDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @IsOptional()
  categoryId?: string;

  @IsOptional()
  brandId?: string;

  @IsOptional()
  @IsIn(PUBLIC_PRODUCT_SORT_VALUES)
  sort?: PublicProductSort;
}
