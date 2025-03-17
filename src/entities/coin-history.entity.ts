import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Coin } from './coin.entity';

export enum CoinTransactionType {
  CHARGE = 'CHARGE', // 충전
  SPEND = 'SPEND', // 사용
  REFUND = 'REFUND', // 환불
  FAILED = 'FAILED', // 실패
}

export enum ReferenceType {
  GACHA = 'GACHA', // 뽑기
  TRANSACTION = 'TRANSACTION', // 결제
}

@Entity()
export class CoinHistory extends BaseEntity {
  @Column({ type: 'enum', enum: CoinTransactionType })
  transactionType: CoinTransactionType; // CHARGE, SPEND, REFUND

  @Column({ type: 'int' })
  amount: number; // 변동된 코인 개수 (양수: 충전, 음수: 사용)

  @Column({ type: 'enum', enum: ReferenceType })
  referenceType?: ReferenceType; // 관련된 트랜잭션 타입 (예: 뽑기, 결제)

  @Column()
  referenceId: string; // 관련된 트랜잭션 ID (예: 뽑기 ID, 결제 ID)

  @ManyToOne(() => Coin, (coin) => coin.coinHistories)
  coin: Coin;
}
