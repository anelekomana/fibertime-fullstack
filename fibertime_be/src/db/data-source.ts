import 'dotenv/config';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.BE_DB_HOST,
  port: parseInt(process.env.BE_DB_PORT || '5432'),
  username: process.env.BE_DB_USER,
  password: process.env.BE_DB_PASS,
  database: process.env.BE_DB_NAME,
  entities: ['src/modules/**/entities/*.entity.ts'],
  migrations: ['src/db/migrations/*.ts'],
  logging: false,
  synchronize: false,
  migrationsTableName: 'f_migrations',
  migrationsRun: false,
});
