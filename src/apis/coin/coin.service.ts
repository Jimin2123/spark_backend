import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoinHistory, CoinTransactionType, ReferenceType } from 'src/entities/coin-history.entity';
import { CoinTransaction, CoinTransactionStatus } from 'src/entities/coin-transaction.entity';
import { Coin } from 'src/entities/coin.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CoinService {
  constructor(
    @InjectRepository(Coin)
    private readonly coinRepository: Repository<Coin>,
    @InjectRepository(CoinTransaction)
    private readonly coinTransactionRepository: Repository<CoinTransaction>,
    @InjectRepository(CoinHistory)
    private readonly coinHistoryRepository: Repository<CoinHistory>,
  ) {}

  /**
   * 사용자의 코인 잔액을 조회하는 메서드
   * @param userId
   * @returns 0 이상의 숫자
   */
  async getBalance(userId: string) {
    const coin = await this.coinRepository.findOne({ where: { user: { uid: userId } } });
    return coin ? coin.balance : 0;
  }

  /**
   * 사용자의 코인 충전을 대기하는 메서드
   * @param userId
   * @param amount
   */
  async pendingCharge(userId: string, amount: number): Promise<void> {
    const coinTransaction = this.coinTransactionRepository.create({
      user: { uid: userId },
      amount,
    });
    await this.coinTransactionRepository.save(coinTransaction);
  }

  /**
   * 사용자의 코인 충전을 성공 처리하는 메서드
   * @param userId
   * @param coinTransactionId
   * @param paymentKey
   */
  async successCharge(userId: string, coinTransactionId: string, paymentKey: string): Promise<void> {
    // 코인 트랜잭션 조회
    const coinTransaction = await this.coinTransactionRepository.findOne({
      where: { uid: coinTransactionId, user: { uid: userId } },
    });

    if (!coinTransaction) {
      throw new NotFoundException('CoinTransaction not found');
    }

    // 코인 트랜잭션 상태 변경
    coinTransaction.status = CoinTransactionStatus.SUCCESS;
    coinTransaction.paymentGatewayId = paymentKey;
    await this.coinTransactionRepository.save(coinTransaction);

    // 코인 잔액 변경
    let coin = await this.coinRepository.findOne({ where: { user: { uid: userId } } });
    if (!coin) {
      coin = this.coinRepository.create({ user: { uid: userId }, balance: 0 });
    }
    coin.balance += coinTransaction.amount;
    await this.coinRepository.save(coin);

    // 코인 변동 내역 저장
    const coinHistory = this.coinHistoryRepository.create({
      coin,
      transactionType: CoinTransactionType.CHARGE,
      amount: coinTransaction.amount,
      referenceType: ReferenceType.TRANSACTION,
      referenceId: coinTransaction.uid,
    });
    await this.coinHistoryRepository.save(coinHistory);
  }
}
