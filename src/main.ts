import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';

async function bootstrap() {
  const allowList = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim())
    : [];
  const logger = new Logger('Bootstrap');
  logger.log('Starting application...');

  try {
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });

    logger.log('NestFactory.create completed');

    app.setGlobalPrefix('api/v1');

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalInterceptors(new ResponseInterceptor());

    const port = process.env.PORT ?? 3001;
    app.enableCors({
      origin: allowList.length > 0 ? allowList : '*',
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-ADMIN-KEY'],
      credentials: true, // ถ้าใช้ cookie / session
    });
    await app.listen(port);
    logger.log(`Application is running on port ${port}`);
  } catch (error) {
    logger.error('Failed to start application:', error);
    process.exit(1);
  }
}
bootstrap();
