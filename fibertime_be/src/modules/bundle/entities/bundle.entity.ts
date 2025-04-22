import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Bundle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name: string;

  @Column({ type: 'timestamp' })
  expirationDate: Date;
}
