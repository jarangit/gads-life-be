import { Category } from '../../../public-categories/interface/response';
import { PublicProductResponse } from 'src/public/public-products/public-products.service';

export interface IHomeResponse {
  categories: Category[];
  topPicks?: PublicProductResponse[];
}
