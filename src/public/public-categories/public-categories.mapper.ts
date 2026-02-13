import { Category } from '../../admin/category/entities/category.entity';
import { Product } from '../../admin/products/entities/product.entity';
import {
  ICategoryProductsResponse,
  Item,
  Category as CategoryResponse,
  Pagination,
} from './interface/response';

export function toCategoryResponse(category: Category): CategoryResponse {
  return {
    id: category.id,
    slug: category.slug,
    nameTh: category.nameTh,
    nameEn: category.nameEn,
    description: category.description,
    heroImage: category.heroImage,
    isActive: !!category.isActive,
    orderIndex: category.orderIndex,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
}

export function toItem(product: Product): Item {
  return {
    id: product.id,
    slug: product.name.toLowerCase().replace(/\s+/g, '-'),
    name: product.name,
    image: product.image ?? null,
    overallScore: Number(product.overallScore),
    isRecommended: product.isRecommended,
    price: product.price,
    currency: product.currency,
    priceLabel: product.priceLabel,
    brand: product.brand
      ? {
          id: product.brand.id as unknown as number,
          name: product.brand.name,
          slug: product.brand.slug,
        }
      : { id: 0, name: '', slug: '' },
    lastUpdated: new Date(product.lastUpdated),
  };
}

export function toPublicCategory(
  category: Category,
  products: Product[],
  pagination: Pagination,
): ICategoryProductsResponse {
  return {
    category: toCategoryResponse(category),
    items: products.map(toItem),
    pagination,
  };
}
