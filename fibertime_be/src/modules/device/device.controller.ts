import {
  Controller,
  Post,
  Get,
  Query,
  Body,
  UseGuards,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { DeviceService } from './device.service';
import { Role, RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { Roles } from '../auth/decorators/roles.decorator';

@UseInterceptors(CacheInterceptor)
@ApiTags('Device')
@Controller('device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @ApiOperation({
    summary: 'Generate a random 4-character device pairing code',
  })
  @ApiBody({
    schema: {
      properties: {
        userId: { type: 'string' },
        macAddress: { type: 'string' },
      },
      required: ['userId', 'macAddress'],
    },
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  @Post('create-device-code')
  createDeviceCode(
    @Body('userId') userId: string,
    @Body('macAddress') macAddress: string,
  ) {
    return this.deviceService.createPairingCode(userId, macAddress);
  }

  @ApiOperation({ summary: 'Get device by pairing code' })
  @ApiBody({
    schema: {
      properties: {
        code: { type: 'string' },
      },
    },
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  @CacheKey('device-by-code')
  @CacheTTL(10)
  @Get()
  getDevice(@Query('code') code: string) {
    return this.deviceService.getDeviceByCode(code);
  }

  @ApiOperation({ summary: 'Connect device to a bundle' })
  @ApiBody({
    schema: {
      properties: {
        deviceCode: { type: 'string' },
      },
      required: ['deviceCode', 'bundleId'],
    },
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  @Post('connect-device')
  connectDevice(@Body('deviceCode') deviceCode: string) {
    return this.deviceService.connectDevice(deviceCode);
  }

  @ApiOperation({ summary: 'Check if device connection is successful' })
  @ApiBody({
    schema: {
      properties: {
        deviceCode: { type: 'string' },
      },
    },
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  @CacheKey('device-connection-status')
  @CacheTTL(10)
  @Get('connection-status')
  connectionStatus(@Query('code') code: string) {
    return this.deviceService.getConnectionStatus(code);
  }
}
