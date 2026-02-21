# Reports Module - Dashboard Analytics API

ระบบรายงานข้อมูลและการวิเคราะห์ความเคลื่อนไหวของข้อมูล สำหรับ Dashboard ของเว็บไซต์

## ภาพรวม

Reports Module ให้บริการ API สำหรับดึงข้อมูลสถิติและการวิเคราะห์ของระบบ ซึ่งสามารถนำไปใช้แสดงบนแดชบอร์ด เช่น:

- 📊 สรุปข้อมูลหลัก (Dashboard Summary)
- 📈 แนวโน้มการสร้างข้อมูลตามเวลา (Trends)
- 🏆 การวิเคราะห์ผลการดำเนินการ (Top Performers)
- 📉 ความเคลื่อนไหวของข้อมูล (Data Volatility)

## API Endpoints

### 1. Dashboard Summary
แสดงข้อมูลสรุปหลักของแดชบอร์ด

```
GET /admin/reports/dashboard
```

**Response:**
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

### 2. Full Analytics Report
รายงานการวิเคราะห์โดยละเอียด (รายงานหลัก)

```
GET /admin/reports/analytics?startDate=2024-01-21&endDate=2024-02-21
```

**Query Parameters:**
- `startDate` (optional): วันเริ่มต้น (YYYY-MM-DD)
- `endDate` (optional): วันสิ้นสุด (YYYY-MM-DD)

**Response Structure:**
```json
{
  "success": true,
  "data": {
    "generatedAt": "2024-02-21T10:00:00.000Z",
    "period": {
      "startDate": "2024-01-21T00:00:00.000Z",
      "endDate": "2024-02-21T23:59:59.999Z"
    },
    "summary": {
      "totalProducts": 50,
      "totalBrands": 10,
      "totalCategories": 8,
      "totalCollections": 5
    },
    "trends": {
      "products": {
        "label": "Products",
        "data": [
          { "date": "2024-01-21", "count": 2 },
          { "date": "2024-01-22", "count": 5 }
        ]
      },
      "brands": { /* similar structure */ },
      "categories": { /* similar structure */ },
      "collections": { /* similar structure */ }
    },
    "analysis": {
      "topCategories": [
        {
          "categoryId": "cat123",
          "categoryName": "Electronics",
          "totalProducts": 20,
          "percentageOfTotal": 40
        }
      ],
      "topBrands": [ /* similar structure */ ],
      "topCollections": [ /* similar structure */ ],
      "productsByStatus": [
        {
          "status": "published",
          "count": 35,
          "percentage": 70
        }
      ]
    },
    "dataVolatility": [
      {
        "metric": "Product Creation Volatility",
        "value": 2.5,
        "unit": "std_dev",
        "description": "Standard deviation of daily product creations: 2.50"
      }
    ]
  }
}
```

### 3. Product Trends
แนวโน้มการสร้างสินค้าแต่ละวัน

```
GET /admin/reports/trends/products?startDate=2024-01-21&endDate=2024-02-21
```

**Response:**
```json
{
  "success": true,
  "data": {
    "label": "Products",
    "data": [
      { "date": "2024-01-21", "count": 2 },
      { "date": "2024-01-22", "count": 5 },
      { "date": "2024-01-23", "count": 3 }
    ]
  }
}
```

### 4. Brand Trends
```
GET /admin/reports/trends/brands?startDate=2024-01-21&endDate=2024-02-21
```

### 5. Category Trends
```
GET /admin/reports/trends/categories?startDate=2024-01-21&endDate=2024-02-21
```

### 6. Collection Trends
```
GET /admin/reports/trends/collections?startDate=2024-01-21&endDate=2024-02-21
```

### 7. Top Categories
แสดงหมวดหมู่ยอดนิยม จัดเรียงตามจำนวนสินค้า

```
GET /admin/reports/analytics/categories?limit=5
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "categoryId": "cat123",
      "categoryName": "Electronics",
      "totalProducts": 20,
      "percentageOfTotal": 40
    }
  ]
}
```

### 8. Top Brands
```
GET /admin/reports/analytics/brands?limit=5
```

### 9. Top Collections
```
GET /admin/reports/analytics/collections?limit=5
```

### 10. Products by Status
การแจกแจงสินค้าตามสถานะ

```
GET /admin/reports/analytics/products-by-status
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "status": "published",
      "count": 35,
      "percentage": 70
    },
    {
      "status": "draft",
      "count": 15,
      "percentage": 30
    }
  ]
}
```

### 11. Data Volatility
ความเคลื่อนไหวของข้อมูลและอัตราการเติบโต

```
GET /admin/reports/volatility?startDate=2024-01-21&endDate=2024-02-21
```

**Metrics Returned:**
- **Product Creation Volatility**: ส่วนเบี่ยงเบนมาตรฐานของการสร้างสินค้า
- **Brand Creation Volatility**: ส่วนเบี่ยงเบนมาตรฐานของการสร้างแบรนด์
- **Category Creation Volatility**: ส่วนเบี่ยงเบนมาตรฐานของการสร้างหมวดหมู่
- **Product Growth Rate**: อัตราการเติบโตแบบเปรียบเทียบ (month-over-month)

## File Structure

```
src/admin/reports/
├── dto/
│   ├── analytics.dto.ts           # DTOs for analytics data
│   ├── dashboard-summary.dto.ts   # Dashboard summary DTO
│   └── date-range.dto.ts          # Date range query DTO
├── reports.controller.ts           # API endpoints
├── reports.controller.spec.ts      # Controller tests
├── reports.module.ts               # Module definition
├── reports.service.ts              # Business logic
└── reports.service.spec.ts         # Service tests
```

## Installation & Setup

### 1. Module is already imported in `app.module.ts`

```typescript
import { ReportsModule } from './admin/reports/reports.module';

@Module({
  imports: [
    // ... other imports
    ReportsModule,
  ],
})
export class AppModule {}
```

### 2. Start the development server

```bash
npm run start:dev
```

### 3. Test using Bruno

Bruno API test files are available in:
```
gads-life/admin/reports/
├── folder.bru
├── get-dashboard.bru
├── get-analytics.bru
├── get-product-trends.bru
├── get-top-categories.bru
├── get-top-brands.bru
├── get-products-by-status.bru
└── get-volatility.bru
```

## Usage Examples

### JavaScript/Fetch Example

```javascript
// Get dashboard summary
const response = await fetch('http://localhost:3000/admin/reports/dashboard');
const data = await response.json();
console.log(data.data.totalProducts);

// Get analytics with date range
const startDate = '2024-01-21';
const endDate = '2024-02-21';
const analyticsUrl = `http://localhost:3000/admin/reports/analytics?startDate=${startDate}&endDate=${endDate}`;
const analyticsResponse = await fetch(analyticsUrl);
const analyticsData = await analyticsResponse.json();
```

### React Example

```typescript
import { useState, useEffect } from 'react';

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/admin/reports/dashboard')
      .then(res => res.json())
      .then(data => {
        setSummary(data.data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Total Products: {summary?.totalProducts}</p>
      <p>Total Brands: {summary?.totalBrands}</p>
      <p>Total Categories: {summary?.totalCategories}</p>
      <p>Total Collections: {summary?.totalCollections}</p>
    </div>
  );
}
```

## Data Volatility Explanation

### Standard Deviation (std_dev)
ตัวชี้วัดความแปรปรวนในจำนวนข้อมูลที่สร้างขึ้นต่อวัน:
- **ค่าต่ำ**: การสร้างข้อมูลเสถียรและสม่ำเสมอ
- **ค่าสูง**: การสร้างข้อมูลมีความผันแปรมาก

### Growth Rate (percent_change)
อัตราเปอร์เซ็นต์การเพิ่มขึ้น/ลดลงระหว่างช่วงเวลาครึ่งแรกและครึ่งหลัง:
- **ค่าบวก**: ข้อมูลมีแนวโน้มเพิ่มขึ้น
- **ค่าลบ**: ข้อมูลมีแนวโน้มลดลง

## Default Date Range

เมื่อไม่ระบุ `startDate` และ `endDate`:
- **endDate**: วันปัจจุบัน
- **startDate**: 30 วันไปแล้ว

## Performance Considerations

- ทองสถิติที่ได้ถูกคำนวณแบบเรียลไทม์จากฐานข้อมูล
- สำหรับข้อมูลจำนวนมาก อาจต้องพิจารณาการ caching หรือ background jobs
- ช่วงวันที่ที่กำหนดควรไม่เกิน 1 ปี เพื่อประสิทธิภาพที่ดีที่สุด

## Testing

Run the test suite:

```bash
# Unit tests
npm test src/admin/reports

# E2E tests
npm run test:e2e
```

## Future Enhancements

- [ ] Export reports to PDF/CSV
- [ ] Scheduled report generation
- [ ] Custom date range presets (Today, Week, Month, Year)
- [ ] Advanced filtering and segmentation
- [ ] Real-time dashboard updates (WebSocket)
- [ ] Report caching and performance optimization
- [ ] Custom metrics and KPIs configuration

## Support

For issues or questions, please refer to the main project documentation.
