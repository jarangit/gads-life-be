import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductKeyHighlight } from './entities/product-key-highlight.entity';
import { ProductWeakness } from './entities/product-weakness.entity';
import { ProductBeforePurchasePoint } from './entities/product-before-purchase-point.entity';
import { ProductAfterUsagePoint } from './entities/product-after-usage-point.entity';
import { ProductPro } from './entities/product-pro.entity';
import { ProductCon } from './entities/product-con.entity';
import { ProductQuickVerdict } from './entities/product-quick-verdict.entity';
import { ProductQuickVerdictTag } from './entities/product-quick-verdict-tag.entity';
import { ProductPricing } from './entities/product-pricing.entity';
import { ProductFinalVerdictPoint } from './entities/product-final-verdict-point.entity';

/**
 * Register all new product-detail entities so that
 * autoLoadEntities picks them up and synchronize creates the tables.
 *
 * Usage: import ProductDetailsModule in AppModule.imports[]
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductKeyHighlight,
      ProductWeakness,
      ProductBeforePurchasePoint,
      ProductAfterUsagePoint,
      ProductPro,
      ProductCon,
      ProductQuickVerdict,
      ProductQuickVerdictTag,
      ProductPricing,
      ProductFinalVerdictPoint,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class ProductDetailsModule {}
