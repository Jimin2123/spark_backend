import { Check, Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { CoinHistory } from './coin-history.entity';
import { BaseEntity } from './base.entity';

@Entity()
export class Coin extends BaseEntity {
  @Column({ type: 'integer', default: 0 })
  @Check(`balance >= 0`) // 음수로 내려가지 못하게 제약조건 추가
  balance: number; // 코인 보유량

  @OneToOne(() => User, (user) => user.coin, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @OneToMany(() => CoinHistory, (coinHistory) => coinHistory.coin, { onDelete: 'CASCADE' })
  coinHistories: CoinHistory[];
}
