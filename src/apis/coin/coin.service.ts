import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoinHistory, CoinTransactionType, ReferenceType } from 'src/entities/coin-history.entity';
import { CoinTransaction, CoinTransactionStatus } from 'src/entities/coin-transaction.entity';
import { Coin } from 'src/entities/coin.entity';
import { TransactionUtil } from 'src/utils/transaction.util';
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
    private readonly transactionUtil: TransactionUtil,
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
  async pendingCharge(userId: string, amount: number): Promise<CoinTransaction> {
    const coinTransaction = this.coinTransactionRepository.create({
      user: { uid: userId },
      amount,
    });
    return await this.coinTransactionRepository.save(coinTransaction);
  }

  /**
   * 사용자의 코인 충전을 성공 처리하는 메서드
   * @param coinTransactionId
   * @param paymentKey
   * @returns 코인
   */
  async successCharge(coinTransactionId: string, paymentKey: string): Promise<Coin> {
    return await this.transactionUtil.runInTransaction(async (queryRunner) => {
      // 코인 트랜잭션 조회
      const coinTransaction = await queryRunner.manager.findOne(CoinTransaction, {
        where: { uid: coinTransactionId },
        relations: ['user'],
      });
      if (!coinTransaction) {
        throw new NotFoundException('CoinTransaction not found');
      }
      // 코인 트랜잭션 상태 변경
      coinTransaction.status = CoinTransactionStatus.SUCCESS;
      coinTransaction.paymentGatewayId = paymentKey;
      const savedCoinTransaction = await queryRunner.manager.save(coinTransaction);

      // 코인 잔액 변경
      const coin = await queryRunner.manager.findOne(Coin, { where: { user: { uid: savedCoinTransaction.user.uid } } });
      if (!coin) {
        throw new NotFoundException('Coin not found');
      }
      coin.balance += coinTransaction.amount;
      const savedCoin = await queryRunner.manager.save(coin);

      // 코인 변동 내역 저장
      const coinHistory = this.coinHistoryRepository.create({
        coin: savedCoin,
        transactionType: CoinTransactionType.CHARGE,
        amount: savedCoinTransaction.amount,
        referenceType: ReferenceType.TRANSACTION,
        referenceId: savedCoinTransaction.uid,
      });
      await queryRunner.manager.save(coinHistory);

      return savedCoin;
    });
  }

  /**
   * 사용자의 코인 충전을 실패 처리하는 메서드
   * @param coinTransactionId
   * @param paymentGatewayId
   */
  async failedCharge(coinTransactionId: string, paymentGatewayId?: string): Promise<void> {
    // 코인 트랜잭션 조회

    const coinTransaction = paymentGatewayId
      ? await this.coinTransactionRepository.findOne({
          where: { uid: coinTransactionId, paymentGatewayId },
        })
      : await this.coinTransactionRepository.findOne({ where: { uid: coinTransactionId } });

    if (!coinTransaction) {
      throw new NotFoundException('CoinTransaction not found');
    }

    // 코인 트랜잭션 상태 변경
    coinTransaction.status = CoinTransactionStatus.FAILED;
    await this.coinTransactionRepository.save(coinTransaction);
  }
}
