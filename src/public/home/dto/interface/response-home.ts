import { Category } from '../../../public-categories/interface/response';
import { PublicProductResponse } from '../../../../public/public-products/public-products.service';
import { IBrandResponse } from 'src/public/public-brands/interface/response-brand';

export interface IHomeResponse {
  categories: Category[];
  topPicks?: PublicProductResponse[];
  lastReview?: PublicProductResponse[];
  topBrands?: IBrandResponse[];
}
