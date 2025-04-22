import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bundle } from './entities/bundle.entity';

@Injectable()
export class BundleService {
  constructor(
    @InjectRepository(Bundle)
    private bundleRepository: Repository<Bundle>,
  ) {}

  async getBundleInfo(id: string): Promise<Bundle> {
    const bundle = await this.bundleRepository.findOneBy({ id });
    if (!bundle) throw new NotFoundException('Device not found');
    return bundle;
  }
}
