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
}
