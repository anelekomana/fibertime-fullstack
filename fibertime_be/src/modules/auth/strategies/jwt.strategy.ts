import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../user/entities/user.entity';

export interface JwtPayload {
  phoneNumber: string;
  role: 'admin' | ' user';
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.BE_JWT_SECRET!,
    });
  }

  async validate(payload: JwtPayload) {
    const { phoneNumber } = payload;
    const user = await this.userRepository.findOne({ where: { phoneNumber } });
    if (!user) throw new Error('User not found');
    return user;
  }
}
