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

export interface IHomeResponse {
  categories: Category[];
  topPicks?: PublicProductResponse[];
  lastReview?: PublicProductResponse[];
  topBrands?: IBrandResponse[];
  sellProducts?: PublicProductResponse[];
  quickVerdictProducts?: IQuickVerdictProductItem[];
}
