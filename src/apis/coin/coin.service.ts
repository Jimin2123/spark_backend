import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoinHistory } from 'src/entities/coin-history.entity';
import { CoinTransaction } from 'src/entities/coin-transaction.entity';
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
}
