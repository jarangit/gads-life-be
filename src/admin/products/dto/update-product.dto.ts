import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { CreateProductRatingDto } from './create-product.dto';
import { ProductStatus } from './validate.dto';

export class UpdateProductDto extends PartialType(CreateProductRatingDto) {
  @IsString()
  @IsOptional()
  categoryId?: string | null;

  @IsString()
  @IsOptional()
  brandId?: string | null;

  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;
}
