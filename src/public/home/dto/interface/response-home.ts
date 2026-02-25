import { Category } from '../../../public-categories/interface/response';
import { PublicProductResponse } from '../../../../public/public-products/public-products.service';
import { IBrandResponse } from 'src/public/public-brands/interface/response-brand';

export interface IQuickVerdictProductItem {
  id: string;
  slug?: string | null;
  name: string;
  quickVerdict: string;
  categoryName: string | null;
}

export interface IFeaturedArticleItem {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  heroImage?: string | null;
  heroImageAlt?: string | null;
  type: string;
  publishedAt?: Date | null;
}

export interface IHomeResponse {
  categories: Category[];
  topPicks?: PublicProductResponse[];
  lastReview?: PublicProductResponse[];
  topBrands?: IBrandResponse[];
  sellProducts?: PublicProductResponse[];
  quickVerdictProducts?: IQuickVerdictProductItem[];
  featuredArticles?: IFeaturedArticleItem[];
}
