import { CollectionStatus, CollectionType } from '../../../admin/collection/entities/collection.entity';
import { PublicCollectionItemResponse } from './public-collection-item.type';

export type PublicCollectionResponse = {
  id: string;
  type: CollectionType;
  slug: string;
  titleTh: string;
  titleEn: string | null;
  excerpt: string | null;
  coverImage: string | null;
  categoryId: string | null;
  category: {
    id: string;
    slug: string;
    nameTh: string;
    nameEn: string | null;
  } | null;
  status: CollectionStatus;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  items: PublicCollectionItemResponse[];
};
