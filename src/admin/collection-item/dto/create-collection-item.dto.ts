import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsOptional,
  IsDateString,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCollectionItemDto {
  @IsString()
  @IsNotEmpty()
  collectionId: string;

  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  orderIndex?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  originalPrice?: number | null;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  dealPrice?: number | null;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  currency?: string;

  @IsOptional()
  @IsDateString()
  dealStartAt?: string | null;

  @IsOptional()
  @IsDateString()
  dealEndAt?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  dealBadge?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(2048)
  dealUrl?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  note?: string | null;
}
