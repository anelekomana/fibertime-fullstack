import { Controller, Get, Param } from '@nestjs/common';
import { BundleService } from './bundle.service';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';

@ApiTags('Bundle')
@Controller('bundle')
export class BundleController {
  constructor(private readonly bundleService: BundleService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get bundle info by ID' })
  @ApiParam({ name: 'id', type: 'string' })
  @CacheKey('bundle-info')
  @CacheTTL(60)
  getBundleInfo(@Param('id') id: string) {
    return this.bundleService.getBundleInfo(id);
  }
}
