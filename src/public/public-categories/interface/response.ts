export interface ICategoryProductsResponse {
  category: Category;
  // query: Query;
  items?: Item[];
  // facets: Facets;
  pagination?: Pagination;
}

export interface Category {
  id: string;
  slug: string;
  nameTh: string;
  nameEn: string | null;
  description: string | null;
  heroImage: string | null;
  isActive: boolean;
  orderIndex: number;
  createdAt: Date;
  updatedAt: Date;
  // optional
  productCount?: number;
}

export interface SEO {
  title: string;
  description: string;
}

export interface Facets {
  brands: Brand[];
  priceRange: PriceRange;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  count?: number;
}

export interface PriceRange {
  min: number;
  max: number;
}

export interface Item {
  id: string;
  slug: string;
  name: string;
  image: string | null;
  overallScore: number;
  isRecommended: boolean;
  price: number;
  currency: string;
  priceLabel: string;
  brand: Brand;
  lastUpdated: Date;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Query {
  page: number;
  limit: number;
  sort: string;
  filters: Filters;
}

export interface Filters {
  brand: string[];
  recommended: boolean;
  minPrice: null;
  maxPrice: null;
}
