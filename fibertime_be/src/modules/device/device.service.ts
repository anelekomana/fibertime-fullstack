import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Device } from './entities/device.entity';
import { PairingCode } from './entities/pairing-code.entity';
import { Bundle } from '../bundle/entities/bundle.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(Device) private deviceRepo: Repository<Device>,
    @InjectRepository(PairingCode)
    private pairingCodeRepo: Repository<PairingCode>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Bundle)
    private bundleRepository: Repository<Bundle>,
  ) {}

  async generatePairingCode(): Promise<PairingCode> {
    const code = Math.random().toString(36).substring(2, 6).toUpperCase();
    const expiresAt = new Date(Date.now() + 5 * 60000); // Expires in 5 minutes
    const pairingCode = this.pairingCodeRepo.create({ code, expiresAt });
    await this.pairingCodeRepo.save(pairingCode);
    return pairingCode;
  }

  async createPairingCode(
    userId: string,
    macAddress: string,
  ): Promise<PairingCode> {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found');

    const existingDevice = await this.deviceRepo.findOne({
      where: { macAddress },
      relations: ['user', 'bundle', 'pairingCode'],
    });

    if (existingDevice?.pairingCode) {
      const isCodeValid =
        new Date() < new Date(existingDevice.pairingCode.expiresAt);
      if (isCodeValid) return existingDevice.pairingCode;
    }

    const newPairingCode = await this.generatePairingCode();

    if (existingDevice) {
      existingDevice.pairingCode = newPairingCode;
      existingDevice.status = 'disconnected';
      await this.deviceRepo.save(existingDevice);
    } else {
      const newDevice = this.deviceRepo.create({
        macAddress,
        user,
        pairingCode: newPairingCode,
        status: 'disconnected',
      });
      await this.deviceRepo.save(newDevice);
    }

    return newPairingCode;
  }

  async getDeviceByCode(code: string): Promise<Device> {
    const pairingCode = await this.pairingCodeRepo.findOne({ where: { code } });
    if (!pairingCode) throw new NotFoundException('Invalid code');

    const device = await this.deviceRepo.findOne({
      where: { pairingCode: { id: pairingCode.id } },
      relations: ['user', 'bundle', 'pairingCode'],
    });
    if (!device) throw new NotFoundException('Device not found');

    return device;
  }

  async connectDevice(code: string): Promise<{ status: string }> {
    const pairingCode = await this.pairingCodeRepo.findOne({ where: { code } });
    if (!pairingCode || new Date() > new Date(pairingCode.expiresAt)) {
      if (pairingCode) {
        pairingCode.status = 'expired';
        await this.pairingCodeRepo.save(pairingCode);
      }
      throw new NotFoundException('Invalid or expired code');
    }

    const device = await this.deviceRepo.findOne({
      where: { pairingCode: { id: pairingCode.id } },
      relations: ['user', 'bundle', 'pairingCode'],
    });
    if (!device) throw new NotFoundException('Device not found');

    const expirationDate = new Date();
    // For demo purposes we set the bundle expiration date to 30 days from now
    expirationDate.setDate(expirationDate.getDate() + 30);

    const bundle = this.bundleRepository.create({
      name: new Date().toISOString(),
      expirationDate,
    });

    device.bundle = await this.bundleRepository.save(bundle);
    device.status = 'connected';
    await this.deviceRepo.save(device);

    return { status: device.status };
  }

  async setConnectionStatus(
    code: string,
    status: 'connected' | 'disconnected',
  ): Promise<Device> {
    const pairingCode = await this.pairingCodeRepo.findOne({ where: { code } });
    if (!pairingCode) throw new NotFoundException('Invalid code');

    const device = await this.deviceRepo.findOne({
      where: { pairingCode: { id: pairingCode.id } },
      relations: ['user', 'bundle', 'pairingCode'],
    });
    if (!device) throw new NotFoundException('Device not found');

    device.status = status;
    return await this.deviceRepo.save(device);
  }

  async getConnectionStatus(code: string): Promise<{ status: string }> {
    const pairingCode = await this.pairingCodeRepo.findOne({ where: { code } });
    if (!pairingCode) throw new NotFoundException('Invalid code');

    const device = await this.deviceRepo.findOne({
      where: { pairingCode: { id: pairingCode.id } },
    });
    if (!device) throw new NotFoundException('Device not found');
    return { status: device.status };
  }

  // This could be run by a cron to delete all expired pairing codes
  async removeExpiredPairingCodes(): Promise<void> {
    const expiryTime = new Date(Date.now() - 5 * 60000);
    await this.pairingCodeRepo.delete({ createdAt: LessThan(expiryTime) });
  }
}
