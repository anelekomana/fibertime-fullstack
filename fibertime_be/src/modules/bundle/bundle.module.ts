import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bundle } from './entities/bundle.entity';
import { BundleService } from './bundle.service';
import { BundleController } from './bundle.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Bundle])],
  controllers: [BundleController],
  providers: [BundleService],
  exports: [BundleService],
})
export class BundleModule {}
