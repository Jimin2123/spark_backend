import { Column, Entity, Index, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserRole } from 'src/common/enums/user-role.enum';
import { LocalAccount } from './local-account.entity';
import { RefreshToken } from './refresh-token.entity';
import { Address } from './address.entity';
import { UserActivityLevel } from 'src/common/enums/user-activity-level.enum';
import { UserGender } from 'src/common/enums/user-gender.enum';
import { UserRestriction } from './user-restriction.entity';

@Entity()
@Index('user_username_unique', ['username'], { unique: true })
export class User extends BaseEntity {
  @Column()
  username: string;

  @Column()
  nickname: string;

  @Column({ type: 'float', default: 0 })
  weight: number;

  @Column({ type: 'float', default: 0 })
  height: number;

  @Column({ type: 'date', nullable: true })
  birth_date: Date;

  @Column({ type: 'enum', enum: UserGender, default: UserGender.MALE })
  gender: UserGender;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ type: 'enum', enum: UserActivityLevel })
  activity_level: UserActivityLevel;

  @OneToOne(() => LocalAccount, (localAccount) => localAccount.user, { cascade: true })
  localAccount: LocalAccount;

  @OneToOne(() => RefreshToken, (refreshToken) => refreshToken.user, { cascade: true })
  refreshToken: RefreshToken;

  @OneToMany(() => Address, (address) => address.user, { cascade: true })
  addresses: Address;

  @OneToMany(() => UserRestriction, (userRestriction) => userRestriction.user, { cascade: true })
  userRestrictions: UserRestriction;
}
