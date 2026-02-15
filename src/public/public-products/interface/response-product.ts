import { ProductStatus } from '../../../admin/products/dto/validate.dto';
import { Product } from '../../../admin/products/entities/product.entity';

export type PublicProductResponse = {
  id: string;
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
  status: ProductStatus;
  categoryId: string | null;
  brandId: string | null;
  category: Product['category'];
  brand: Product['brand'];
  ratings: Product['ratings'];
  createdAt: Date;
  updatedAt: Date;
};
