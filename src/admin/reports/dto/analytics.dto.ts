export class TrendDataDto {
  date: Date;
  count: number;
}

export class CategoyAnalyticsDto {
  categoryId: string;
  categoryName: string;
  totalProducts: number;
  percentageOfTotal: number;
}

export class BrandAnalyticsDto {
  brandId: string;
  brandName: string;
  totalProducts: number;
  percentageOfTotal: number;
}

export class CollectionAnalyticsDto {
  collectionId: string;
  collectionName: string;
  totalItems: number;
  totalProducts: number;
  percentageOfTotal: number;
}

export class ProductStatusAnalyticsDto {
  status: string;
  count: number;
  percentage: number;
}

export class DataVolatilityDto {
  metric: string;
  value: number;
  unit: string;
  description: string;
}

export class DataTrendDto {
  label: string;
  data: TrendDataDto[];
}

export class AnalyticsReportDto {
  generatedAt: Date;
  period: {
    startDate: Date;
    endDate: Date;
  };
  summary: {
    totalProducts: number;
    totalBrands: number;
    totalCategories: number;
    totalCollections: number;
  };
  trends: {
    products: DataTrendDto;
    brands: DataTrendDto;
    categories: DataTrendDto;
    collections: DataTrendDto;
  };
  analysis: {
    topCategories: CategoyAnalyticsDto[];
    topBrands: BrandAnalyticsDto[];
    topCollections: CollectionAnalyticsDto[];
    productsByStatus: ProductStatusAnalyticsDto[];
  };
  dataVolatility: DataVolatilityDto[];
}
