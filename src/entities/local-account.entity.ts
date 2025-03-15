import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity()
export class LocalAccount extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  isVerified: boolean;

  @OneToOne(() => User, (user) => user.localAccount, { onDelete: 'CASCADE', eager: false })
  @JoinColumn()
  user: User;
}
