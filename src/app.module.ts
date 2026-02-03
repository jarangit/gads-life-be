import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from './admin/category/category.module';
import { ConfigModule } from '@nestjs/config';
import { AdminApiKeyGuard } from './common/guards/admin-api-key.guards';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    CategoryModule,
    AdminApiKeyGuard,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
