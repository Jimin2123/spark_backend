import { Global, Module } from '@nestjs/common';
import { TransactionUtil } from './utils/transaction.util';
import { CacheService } from './modules/redis/cache.service';

@Global()
@Module({
  providers: [TransactionUtil, CacheService], // 전역으로 제공할 서비스
  exports: [TransactionUtil, CacheService], // 모든 모듈에서 사용 가능하게 exports
})
export class CommonModule {}
