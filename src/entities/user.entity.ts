import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserRole } from 'src/common/enums/user-role.enum';
import { LocalAccount } from './local-account.entity';
import { RefreshToken } from './refresh-token.entity';
import { Address } from './address.entity';
import { Coin } from './coin.entity';
import { CoinTransaction } from './coin-transaction.entity';

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

  @OneToOne(() => LocalAccount, (localAccount) => localAccount.user, { cascade: true })
  localAccount: LocalAccount;

  @OneToOne(() => RefreshToken, (refreshToken) => refreshToken.user, { cascade: true })
  refreshToken: RefreshToken;

  @OneToMany(() => Address, (address) => address.user, { cascade: true })
  addresses: Address;

  @OneToOne(() => Coin, (coin) => coin.user, { cascade: true })
  coin: Coin;

  @OneToMany(() => CoinTransaction, (coinTransaction) => coinTransaction.user, { cascade: true })
  coinTransactions: CoinTransaction;
}
