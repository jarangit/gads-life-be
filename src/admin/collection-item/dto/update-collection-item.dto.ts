import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateCollectionItemDto } from './create-collection-item.dto';

export class UpdateCollectionItemDto extends PartialType(
  OmitType(CreateCollectionItemDto, ['collectionId', 'productId'] as const),
) {}
