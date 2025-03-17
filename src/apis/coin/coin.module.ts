import { Module } from '@nestjs/common';
import { CoinService } from './coin.service';
import { CoinController } from './coin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coin } from 'src/entities/coin.entity';
import { CoinHistory } from 'src/entities/coin-history.entity';
import { CoinTransaction } from 'src/entities/coin-transaction.entity';
import { TransactionUtil } from 'src/utils/transaction.util';

@Module({
  imports: [TypeOrmModule.forFeature([Coin, CoinTransaction, CoinHistory])],
  controllers: [CoinController],
  providers: [CoinService, TransactionUtil],
  exports: [CoinService],
})
export class CoinModule {}
