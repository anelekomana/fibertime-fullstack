import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class PairingCode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 4, unique: true })
  code: string;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @Column({ default: 'active' })
  status: 'active' | 'expired';

  @CreateDateColumn()
  createdAt: Date;
}
