import { ProductStatus } from '../../../admin/products/dto/validate.dto';

export type PublicCollectionProductResponse = {
  id: string;
  slug: string | null;
  categoryId: string | null;
  brandId: string | null;
  name: string;
  subtitle: string;
  image: string | null;
  overallScore: number;
  isRecommended: boolean;
  price: number;
  currency: string;
  priceLabel: string;
  affiliateLink: string | null;
  lastUpdated: string;
  createdAt: Date;
  updatedAt: Date;
  status: ProductStatus;
};
