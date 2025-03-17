import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

export enum CoinTransactionStatus {
  DEPOSIT = 'DEPOSIT', // 입금
  REFUND = 'REFUND', // 환불
  FAILED = 'FAILED', // 실패
}

export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD', // 신용카드
  TOSS = 'TOSS', // 토스
  ACCOUNT = 'ACCOUNT', // 계좌이체
  POINT = 'POINT', // 포인트
  COUPON = 'COUPON', // 쿠폰
}

@Entity()
export class CoinTransaction extends BaseEntity {
  @Column({ type: 'enum', enum: CoinTransactionStatus })
  transactionType: CoinTransactionStatus;

  @Column({ type: 'int' })
  amount: number; // 변동된 코인 개수 (양수: 충전, 음수: 환불)

  @Column({ type: 'enum', enum: PaymentMethod })
  paymentMethod: PaymentMethod; // 결제방법 (신용카드, 토스, 계좌이체, 포인트, 쿠폰)

  @Column({ nullable: true })
  paymentGatewayId?: string; // 결제사 트랜잭션 ID (충전 시 필요)

  @ManyToOne(() => User, (user) => user.coinTransactions)
  user: User;
}
