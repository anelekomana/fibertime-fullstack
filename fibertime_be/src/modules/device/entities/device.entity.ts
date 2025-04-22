import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Bundle } from '../../bundle/entities/bundle.entity';
import { PairingCode } from './pairing-code.entity';

@Entity()
export class Device {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  macAddress: string;

  @Column({ default: 'disconnected' })
  status: 'connected' | 'disconnected';

  @ManyToOne(() => User, (user) => user.devices, { nullable: true })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Bundle, { nullable: true })
  @JoinColumn()
  bundle: Bundle;

  @ManyToOne(() => PairingCode, { nullable: true })
  @JoinColumn()
  pairingCode: PairingCode;

  @CreateDateColumn()
  createdAt: Date;
}
