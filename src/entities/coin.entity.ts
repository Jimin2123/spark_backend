import { Check, Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { CoinHistory } from './coin-history.entity';
import { BaseEntity } from './base.entity';

/**
 * 사용자의 현재 보유 코인을 관리하는 엔티티
 * - 코인의 변동 내역은 CoinHistory에서 관리됨
 * - User와 1:1 관계를 맺음
 * - CoinHistory와 1:N 관계를 맺음
 */
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
