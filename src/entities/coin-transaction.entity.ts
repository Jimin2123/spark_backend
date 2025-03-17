import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

export enum CoinTransactionStatus {
  SUCCESS = 'SUCCESS', // 성공
  PENDING = 'PENDING', // 처리 중
  REFUND = 'REFUND', // 환불
  FAILED = 'FAILED', // 실패
}

/**
 * 외부 결제 시스템과 연동된 코인 결제 트랜잭션 엔티티
 * - 결제 진행 상태(PENDING, SUCCESS, FAILED)를 관리
 * - User와 다대일(N:1) 관계
 */
@Entity()
export class CoinTransaction extends BaseEntity {
  @Column({ type: 'enum', enum: CoinTransactionStatus, default: CoinTransactionStatus.PENDING })
  status: CoinTransactionStatus;

  @Column({ type: 'int' })
  amount: number;

  @Column({ nullable: true })
  paymentGatewayId?: string; // 결제사 트랜잭션 ID (충전 시 필요)

  @ManyToOne(() => User, (user) => user.coinTransactions)
  user: User;
}
