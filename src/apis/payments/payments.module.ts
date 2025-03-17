import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { HttpModule } from '@nestjs/axios';
import { CoinModule } from '../coin/coin.module';

@Module({
  imports: [HttpModule, CoinModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
