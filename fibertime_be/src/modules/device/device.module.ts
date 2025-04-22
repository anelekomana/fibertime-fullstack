import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceService } from './device.service';
import { DeviceController } from './device.controller';
import { Device } from './entities/device.entity';
import { PairingCode } from './entities/pairing-code.entity';
import { Bundle } from '../bundle/entities/bundle.entity';
import { User } from '../user/entities/user.entity';
import { BundleModule } from '../bundle/bundle.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Device, PairingCode, Bundle, User]),
    BundleModule,
  ],
  providers: [DeviceService],
  controllers: [DeviceController],
})
export class DeviceModule {}
