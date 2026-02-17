import { PublicCollectionProductResponse } from './public-collection-product.type';

export type PublicCollectionItemResponse = {
  id: string;
  collectionId: string;
  productId: string;
  product: PublicCollectionProductResponse;
  orderIndex: number;
  originalPrice: number | null;
  dealPrice: number | null;
  currency: string;
  dealStartAt: Date | null;
  dealEndAt: Date | null;
  dealBadge: string | null;
  dealUrl: string | null;
  note: string | null;
  createdAt: Date;
};
