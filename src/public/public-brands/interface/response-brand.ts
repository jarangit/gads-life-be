export interface IBrandResponse {
  id: string;
  name: string;
  slug: string;
  tagline?: string | null;
  description?: string | null;
  logoUrl?: string | null;
  ogImageUrl?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  isIndexable: boolean;
  isFollowable: boolean;
  createdAt: Date;
  updatedAt: Date;
  publishedProductsCount?: number;
}
