import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserRole } from 'src/common/enums/user-role.enum';

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  username: string;

  @Column()
  name: string;

  @Column()
  age: number;

  @Column()
  gender: boolean;

  @Column({ type: 'date', nullable: true })
  birth: Date;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ default: false })
  profileCompleted: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  phone: string;

  @Column({ default: 'default-icon' })
  profileImage?: string;
}
