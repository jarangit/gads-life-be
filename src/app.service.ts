import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {
  constructor(private readonly dataSource: DataSource) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getHealthStatus() {
    const uptime = process.uptime();
    let dbStatus: 'up' | 'down' = 'down';

    try {
      await this.dataSource.query('SELECT 1');
      dbStatus = 'up';
    } catch {
      dbStatus = 'down';
    }

    return {
      status: dbStatus === 'up' ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(uptime),
      checks: {
        app: 'up',
        database: dbStatus,
      },
    };
  }
}
