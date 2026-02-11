import { IsEnum, IsOptional } from 'class-validator';

export enum ProductStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

export class FindProductQueryDto {
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @IsOptional()
  categoryId?: string;

  @IsOptional()
  brandId?: string;
}
