import { Category, Pagination } from './response';

export interface ICategoriesListResponse {
  items: Category[];
  pagination: Pagination;
}
