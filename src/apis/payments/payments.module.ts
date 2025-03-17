import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { HttpModule } from '@nestjs/axios';
import { UserService } from '../user/user.service';
import { CacheService } from 'src/modules/redis/cache.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { LocalAccount } from 'src/entities/local-account.entity';
import { Address } from 'src/entities/address.entity';
import { AuthService } from '../auth/auth.service';
import { TransactionUtil } from 'src/utils/transaction.util';
import { RefreshToken } from 'src/entities/refresh-token.entity';
import { TokenService } from '../auth/token.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User, LocalAccount, Address, RefreshToken]), HttpModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, UserService, AuthService, CacheService, TransactionUtil, TokenService, JwtService],
})
export class PaymentsModule {}
