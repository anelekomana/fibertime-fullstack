import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { OTP } from './modules/auth/entities/otp.entity';
import { BundleModule } from './modules/bundle/bundle.module';
import { Bundle } from './modules/bundle/entities/bundle.entity';
import { DeviceModule } from './modules/device/device.module';
import { Device } from './modules/device/entities/device.entity';
import { PairingCode } from './modules/device/entities/pairing-code.entity';
import { User } from './modules/user/entities/user.entity';
import { UserModule } from './modules/user/user.module';
import * as redisStore from 'cache-manager-redis-store';
import { CacheModule } from '@nestjs/cache-manager';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.BE_DB_HOST,
      port: parseInt(process.env.BE_DB_PORT || '5432'),
      username: process.env.BE_DB_USER,
      password: process.env.BE_DB_PASS,
      database: process.env.BE_DB_NAME,
      entities: [PairingCode, User, OTP, Device, Bundle],
      logging: false,
      synchronize: false,
      migrationsTableName: 'f_migrations',
      migrationsRun: false,
    }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      ttl: parseInt(process.env.BE_DB_PORT || '60'),
    }),
    AuthModule,
    DeviceModule,
    UserModule,
    BundleModule,
  ],
})
export class AppModule {}
