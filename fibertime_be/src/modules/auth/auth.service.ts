import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OTP } from './entities/otp.entity';
import { User } from '../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(OTP) private otpRepo: Repository<OTP>,
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async requestOTP(phoneNumber: string): Promise<OTP> {
    let user = await this.userRepo.findOne({ where: { phoneNumber } });
    if (!user) {
      user = this.userRepo.create({ phoneNumber });
      await this.userRepo.save(user);
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60000); // Expires in 5 minutes

    const otpEntity = this.otpRepo.create({ phoneNumber, otp, expiresAt });
    await this.otpRepo.save(otpEntity);

    // In a real application we would send this otp via SMS and not return it here
    return otpEntity;
  }

  async login(
    phoneNumber: string,
    otp: string,
  ): Promise<{ accessToken: string; user: User }> {
    const otpRecord = await this.otpRepo.findOne({
      where: { phoneNumber, otp, status: 'pending' },
    });
    if (!otpRecord || new Date() > otpRecord.expiresAt) {
      if (otpRecord) {
        otpRecord.status = 'used';
        await this.otpRepo.save(otpRecord);
      }
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    otpRecord.status = 'used';
    await this.otpRepo.save(otpRecord);

    const user = await this.userRepo.findOne({ where: { phoneNumber } });
    if (!user) throw new NotFoundException('User not found');

    const payload = { userId: user.id, phoneNumber, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken, user };
  }
}
