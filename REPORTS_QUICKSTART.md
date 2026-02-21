# Reports Module - Quick Start Guide

## 📋 สิ่งที่สร้างขึ้น

ได้สร้าง **Reports Module** เสร็จสมบูรณ์สำหรับการแสดงข้อมูล analytics บนแดชบอร์ด

## 📁 โครงสร้างไฟล์

```
src/admin/reports/
├── dto/
│   ├── analytics.dto.ts              # 📊 Data structures for analytics
│   ├── dashboard-summary.dto.ts      # 🎯 Summary metrics DTO
│   └── date-range.dto.ts             # 📅 Date range query DTO
├── reports.controller.ts              # 🎯 REST API endpoints (11 endpoints)
├── reports.controller.spec.ts        # ✅ Controller tests
├── reports.module.ts                 # 📦 Module definition
├── reports.service.ts                # 🔧 Business logic & analytics
├── reports.service.spec.ts           # ✅ Service tests
└── README.md                         # 📖 Full documentation
```

## 🚀 Getting Started

### Step 1: Module is already integrated
Module ได้เพิ่มเข้าไปใน `app.module.ts` แล้ว

### Step 2: Start the server
```bash
npm run start:dev
```

### Step 3: Test with Bruno
ไปที่ `gads-life/admin/reports/` ในเมนู Bruno 
- `get-dashboard.bru` - Quick stats
- `get-analytics.bru` - Full report
- `get-product-trends.bru` - Trends
- `get-top-categories.bru` - Top categories
- `get-top-brands.bru` - Top brands
- `get-products-by-status.bru` - Status breakdown
- `get-volatility.bru` - Volatility metrics

## 📊 API Endpoints (11 Total)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/admin/reports/dashboard` | GET | 📈 Quick dashboard summary |
| `/admin/reports/analytics` | GET | 📊 Full analytics report |
| `/admin/reports/trends/products` | GET | 📈 Product creation trends |
| `/admin/reports/trends/brands` | GET | 📈 Brand creation trends |
| `/admin/reports/trends/categories` | GET | 📈 Category creation trends |
| `/admin/reports/trends/collections` | GET | 📈 Collection creation trends |
| `/admin/reports/analytics/categories` | GET | 🏆 Top categories |
| `/admin/reports/analytics/brands` | GET | 🏆 Top brands |
| `/admin/reports/analytics/collections` | GET | 🏆 Top collections |
| `/admin/reports/analytics/products-by-status` | GET | 📉 Status distribution |
| `/admin/reports/volatility` | GET | 📊 Data volatility metrics |

## 💡 Key Features

### 1. Dashboard Summary
```
GET /admin/reports/dashboard
```
- Total products, brands, categories, collections
- Created this month counts
- Perfect for KPI cards on dashboard

### 2. Comprehensive Analytics Report
```
GET /admin/reports/analytics?startDate=2024-01-21&endDate=2024-02-21
```
- Summary statistics
- Daily trends for each entity
- Top performers (categories, brands, collections)
- Product status distribution
- Data volatility metrics

### 3. Trend Analysis
- Daily creation counts for each entity type
- Perfect for line charts on dashboard
- Customizable date ranges

### 4. Performance Analytics
- Top 5 categories by product count
- Top 5 brands by product count
- Top 5 collections by item count
- Percentage distribution

### 5. Data Volatility
- Standard deviation of daily creations
- Month-over-month growth rate
- Helps understand data creation patterns

## 📈 Sample Response - Dashboard

```json
{
  "success": true,
  "data": {
    "totalProducts": 50,
    "totalBrands": 10,
    "totalCategories": 8,
    "totalCollections": 5,
    "productsCreatedThisMonth": 15,
    "brandsCreatedThisMonth": 3,
    "categoriesCreatedThisMonth": 2,
    "collectionsCreatedThisMonth": 1
  },
  "timestamp": "2024-02-21T10:00:00.000Z"
}
```

## 🎯 Usage in Frontend

### React Example
```typescript
import { useEffect, useState } from 'react';

function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch('/admin/reports/dashboard')
      .then(r => r.json())
      .then(d => setStats(d.data));
  }, []);

  return (
    <div className="dashboard">
      <div className="stat-card">
        <h3>Total Products</h3>
        <p>{stats?.totalProducts}</p>
      </div>
      <div className="stat-card">
        <h3>Total Brands</h3>
        <p>{stats?.totalBrands}</p>
      </div>
      {/* ... more cards */}
    </div>
  );
}
```

## 🔄 Default Date Range

When `startDate` and `endDate` are not specified:
- **endDate**: Today
- **startDate**: 30 days ago

## 🧪 Testing

```bash
# Run tests
npm test src/admin/reports

# Run with coverage
npm run test:cov
```

## 📖 Full Documentation

See `src/admin/reports/README.md` for complete documentation including:
- Detailed API examples
- All response structures
- Data volatility explanation
- Performance considerations
- Future enhancement ideas

## ⚙️ Configuration

No additional configuration needed! Module is automatically:
- ✅ Registered in AppModule
- ✅ Connected to database entities
- ✅ Ready to use at `/admin/reports/*`

## 🔗 Related Files

- **Module**: [reports.module.ts](./reports.module.ts)
- **Service**: [reports.service.ts](./reports.service.ts)
- **Controller**: [reports.controller.ts](./reports.controller.ts)
- **DTOs**: [dto/](./dto/)
- **Tests**: `*.spec.ts` files
- **Blog**: [README.md](./README.md)

## 🚦 Next Steps

1. ✅ Start the server with `npm run start:dev`
2. ✅ Test endpoints using Bruno API files
3. ✅ Integrate dashboard display in your frontend
4. ⚙️ Customize date ranges/filters as needed
5. 🎨 Create visualization components for data

## 📞 Support

For detailed information, check the README.md in this folder or reach out for customization needs.

---

**Module Created**: February 21, 2026
**Status**: ✅ Production Ready
