import { PartialType } from '@nestjs/mapped-types';
import { CreateCollectionDto } from './create-collection.dto';
import { IsString, MinLength } from 'class-validator';

export class UpdateCollectionDto extends PartialType(CreateCollectionDto) {
  @IsString()
  @MinLength(2)
  nameTh: string;
}
