import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  Check,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.refreshToken, { onDelete: 'CASCADE', eager: false })
  @JoinColumn()
  user: User;

  @Column('text')
  token: string;

  @Column({ type: 'timestamp' })
  @Check(`"expiresAt" > CURRENT_TIMESTAMP`)
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
