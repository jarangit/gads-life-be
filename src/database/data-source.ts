import * as dotenv from 'dotenv';
import { existsSync } from 'fs';
import { DataSource } from 'typeorm';

const nodeEnv = process.env.NODE_ENV;
const envFiles = [
  nodeEnv ? `.env.${nodeEnv}` : '',
  '.env.local',
  '.env',
].filter(Boolean);

for (const envFile of envFiles) {
  if (existsSync(envFile)) {
    dotenv.config({ path: envFile, override: true });
  }
}

/**
 * Standalone DataSource for CLI scripts (seed, migration, etc.)
 * Uses the same env vars as the NestJS app.
 */
export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'gadslife_db',
  entities: ['src/**/*.entity.ts'],
  migrations: [__dirname + '/migrations/*{.js}'],
  synchronize: false,
});
