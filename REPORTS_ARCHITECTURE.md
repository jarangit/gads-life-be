# Reports Module - Architecture & Data Flow

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Dashboard)                      │
│  ┌────────────┬────────────┬────────────┬──────────────────┐    │
│  │ KPI Cards  │ Line Charts│ Bar Charts │ Metric Displays  │    │
│  └────────────┴────────────┴────────────┴──────────────────┘    │
└──────────────────────────────┬──────────────────────────────────┘
                               │ HTTP Requests
                               ▼
┌──────────────────────────────────────────────────────────────────┐
│                    REST API Layer (NestJS)                       │
│                                                                  │
│  Route: GET /admin/reports/*                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │           ReportsController                            │    │
│  │  ┌─────────────────────────────────────────────────┐  │    │
│  │  │ 11 Endpoints:                                   │  │    │
│  │  │ • dashboard                                     │  │    │
│  │  │ • analytics (full report)                       │  │    │
│  │  │ • trends/products, brands, categories, cols     │  │    │
│  │  │ • analytics/categories, brands, collections     │  │    │
│  │  │ • analytics/products-by-status                  │  │    │
│  │  │ • volatility                                    │  │    │
│  │  └─────────────────────────────────────────────────┘  │    │
│  └────────────────────────────────────────────────────────┘    │
└──────────────────────────────┬──────────────────────────────────┘
                               │ Service Calls
                               ▼
┌──────────────────────────────────────────────────────────────────┐
│            Business Logic Layer (ReportsService)                 │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ Service Methods:                                       │    │
│  │ ┌──────────────────────────────────────────────────┐  │    │
│  │ │ Data Retrieval:                                  │  │    │
│  │ │ • getDashboardSummary()                         │  │    │
│  │ │ • getProduct/Brand/Category/CollectionTrends()  │  │    │
│  │ │ • getTopCategories/Brands/Collections()         │  │    │
│  │ │ • getProductsByStatus()                         │  │    │
│  │ │                                                  │  │    │
│  │ │ Analysis:                                        │  │    │
│  │ │ • getAnalyticsReport() [Main method]            │  │    │
│  │ │ • calculateDataVolatility()                     │  │    │
│  │ │                                                  │  │    │
│  │ │ Helpers:                                         │  │    │
│  │ │ • aggregateTrendData()                          │  │    │
│  │ │ • calculateStandardDeviation()                  │  │    │
│  │ │ • calculateGrowthRate()                         │  │    │
│  │ └──────────────────────────────────────────────────┘  │    │
│  └────────────────────────────────────────────────────────┘    │
└──────────────────────────────┬──────────────────────────────────┘
                               │ Database Queries
                               ▼
┌──────────────────────────────────────────────────────────────────┐
│              Data Access Layer (TypeORM)                         │
│                                                                  │
│  ┌────────────┬────────────┬────────────┬─────────────────┐    │
│  │ Product    │ Brand      │ Category   │ Collection      │    │
│  │ Repository │ Repository │ Repository │ Repository      │    │
│  └────────────┴────────────┴────────────┴─────────────────┘    │
└──────────────────────────────┬──────────────────────────────────┘
                               │ TypeORM Queries
                               ▼
┌──────────────────────────────────────────────────────────────────┐
│                    MySQL Database                                │
│                                                                  │
│  ┌──────────────┬──────────────┬──────────────┬─────────────┐  │
│  │ products     │ brands       │ categories   │ collections │  │
│  │ - id         │ - id         │ - id         │ - id        │  │
│  │ - name       │ - name       │ - name       │ - name      │  │
│  │ - createdAt  │ - createdAt  │ - createdAt  │ - createdAt │  │
│  │ - updatedAt  │ - updatedAt  │ - updatedAt  │ - updatedAt │  │
│  │ - status     │ - ...        │ - ...        │ - ...       │  │
│  │ - ...        │              │              │             │  │
│  └──────────────┴──────────────┴──────────────┴─────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Request Flow Example

### Example: Get Dashboard Summary

```
CLIENT REQUEST
    │
    ▼
GET /admin/reports/dashboard
    │
    ▼
┌─────────────────────────────────────────┐
│  ReportsController.getDashboard()       │
└─────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────┐
│  ReportsService.getDashboardSummary()   │
│  • Count products                       │
│  • Count brands                         │
│  • Count categories                     │
│  • Count collections                    │
│  • Count this month's creations         │
└─────────────────────────────────────────┘
    │
    ├──▶ productRepository.count()
    │    └──▶ SELECT COUNT(*) FROM products
    │
    ├──▶ brandRepository.count()
    │    └──▶ SELECT COUNT(*) FROM brands
    │
    ├──▶ categoryRepository.count()
    │    └──▶ SELECT COUNT(*) FROM categories
    │
    └──▶ collectionRepository.count()
         └──▶ SELECT COUNT(*) FROM collections
    │
    ▼
Database returns counts
    │
    ▼
Service aggregates data → DashboardSummaryDto
    │
    ▼
Controller wraps in response → { success, data, timestamp }
    │
    ▼
JSON Response sent to client
```

---

## 📊 Data Transformation Pipeline

```
┌──────────────────────────────────┐
│    Raw Database Data             │
│  (Products, Brands, etc.)        │
└──────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│   Service Processing             │
│  • Aggregate by date             │
│  • Calculate statistics          │
│  • Sort and rank                 │
│  • Calculate percentages         │
└──────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│   DTOs (Type Safety)             │
│  • DashboardSummaryDto           │
│  • AnalyticsReportDto            │
│  • DataTrendDto                  │
│  • TrendDataDto                  │
└──────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│   Controller Response             │
│  {                               │
│    success: true,                │
│    data: { ... },                │
│    timestamp: Date               │
│  }                               │
└──────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│   Frontend Consumption           │
│  • Display in UI                 │
│  • Create charts/graphs          │
│  • Update dashboard              │
└──────────────────────────────────┘
```

---

## 🎯 Data Flow for Analytics Report

```
┌─────────────────────────────┐
│ GET /admin/reports/analytics │
│ ?startDate=...&endDate=...   │
└────────────┬────────────────┘
             │
             ▼
      ┌─────────────────┐
      │  Controller:    │
      │  getAnalytics   │
      │  Report()       │
      └────────┬────────┘
               │
               ▼
      ┌────────────────────────────┐
      │     Service Method:        │
      │     getAnalyticsReport()   │
      └────────┬───────────────────┘
               │
      ┌────────┴─────────────────────────────────┐
      │      Parallel Operations (Promise.all)   │
      │                                          │
      ├── getDashboardSummary()                 │
      │   └──▶ totalProducts, totalBrands, etc. │
      │                                          │
      ├── getProductTrends(start, end)          │
      │   └──▶ [ {date, count}, ... ]           │
      │                                          │
      ├── getBrandTrends(start, end)            │
      │   └──▶ [ {date, count}, ... ]           │
      │                                          │
      ├── getCategoryTrends(start, end)         │
      │   └──▶ [ {date, count}, ... ]           │
      │                                          │
      ├── getCollectionTrends(start, end)       │
      │   └──▶ [ {date, count}, ... ]           │
      │                                          │
      ├── getTopCategories(5)                   │
      │   └──▶ [ {id, name, products, %}, ... ] │
      │                                          │
      ├── getTopBrands(5)                       │
      │   └──▶ [ {id, name, products, %}, ... ] │
      │                                          │
      ├── getTopCollections(5)                  │
      │   └──▶ [ {id, name, items, %}, ... ]    │
      │                                          │
      ├── getProductsByStatus()                 │
      │   └──▶ [ {status, count, %}, ... ]      │
      │                                          │
      └── calculateDataVolatility()             │
          └──▶ [ {metric, value, unit}, ... ]   │
               │
               ▼
      ┌────────────────────────────────┐
      │  Aggregate Results into:       │
      │  AnalyticsReportDto            │
      │  {                             │
      │    generatedAt,                │
      │    period,                     │
      │    summary,                    │
      │    trends,                     │
      │    analysis,                   │
      │    dataVolatility              │
      │  }                             │
      └────────┬───────────────────────┘
               │
               ▼
      ┌───────────────────────┐
      │ Return to Controller  │
      └────────┬──────────────┘
               │
               ▼
      ┌────────────────────────────┐
      │ Format Response:           │
      │ {                          │
      │   success: true,           │
      │   data: analyticsReport,   │
      │   timestamp: now           │
      │ }                          │
      └────────┬───────────────────┘
               │
               ▼
      ┌────────────────────────┐
      │ Send JSON to Frontend  │
      └────────────────────────┘
```

---

## 🗄️ Module Dependencies

```
ReportsModule
  │
  ├─ Imports: [TypeOrmModule.forFeature([...])]
  │   ├─ Product Entity
  │   ├─ Brand Entity
  │   ├─ Category Entity
  │   └─ Collection Entity
  │
  ├─ Controllers: [ReportsController]
  │   └─ Handles HTTP requests
  │
  ├─ Providers: [ReportsService]
  │   └─ Business logic
  │
  └─ Exports: [ReportsService]
     └─ Available for injection
```

---

## 📝 DTO Hierarchy

```
AnalyticsReportDto (Main response)
├── generatedAt: Date
├── period
│   ├── startDate: Date
│   └── endDate: Date
├── summary
│   ├── totalProducts: number
│   ├── totalBrands: number
│   ├── totalCategories: number
│   └── totalCollections: number
├── trends
│   ├── products: DataTrendDto
│   ├── brands: DataTrendDto
│   ├── categories: DataTrendDto
│   └── collections: DataTrendDto
│       └── data: TrendDataDto[]
│           ├── date: Date
│           └── count: number
├── analysis
│   ├── topCategories: CategoyAnalyticsDto[]
│   │   ├── categoryId: string
│   │   ├── categoryName: string
│   │   ├── totalProducts: number
│   │   └── percentageOfTotal: number
│   ├── topBrands: BrandAnalyticsDto[]
│   ├── topCollections: CollectionAnalyticsDto[]
│   └── productsByStatus: ProductStatusAnalyticsDto[]
│       ├── status: string
│       ├── count: number
│       └── percentage: number
└── dataVolatility: DataVolatilityDto[]
    ├── metric: string
    ├── value: number
    ├── unit: string
    └── description: string
```

---

## 🔌 Integration Points

```
app.module.ts
    │
    ├─ Imports ReportsModule
    │
    └─ Makes available globally:
       ├─ /admin/reports/dashboard
       ├─ /admin/reports/analytics
       ├─ /admin/reports/trends/*
       ├─ /admin/reports/analytics/*
       └─ /admin/reports/volatility
```

---

## 🚀 Performance Characteristics

```
Operation                    Complexity  Speed
──────────────────────────────────────────────
getDashboardSummary()        O(n)        Fast
  └─ Multiple COUNT queries

getProductTrends()           O(n log n)  Medium
  └─ Full table scan + sort

getTopCategories()           O(n log n)  Medium
  └─ Load relations + sort

getAnalyticsReport()         O(n log n)  Slow*
  └─ Parallel queries, multiple aggregations

* For large datasets (>100k records), consider:
  - Database indexing on createdAt
  - Query result caching
  - Scheduled background jobs
```

---

## 🎨 Frontend Integration Example

```typescript
// 1. Fetch data
const { data: report } = await fetch('/admin/reports/analytics').then(r => r.json());

// 2. Use for different visualizations
Dashboard.jsx
├─ KPICards.jsx          ← report.summary
├─ TrendCharts.jsx       ← report.trends
├─ TopPerformers.jsx     ← report.analysis.topCategories/Brands/Collections
├─ StatusDistribution.jsx ← report.analysis.productsByStatus
└─ VolatilityMetrics.jsx ← report.dataVolatility
```

---

This architecture ensures:
✅ Clean separation of concerns
✅ Scalability
✅ Type safety
✅ Easy testing
✅ Frontend flexibility
✅ Performance optimization opportunities
