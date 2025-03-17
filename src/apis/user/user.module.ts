import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { LocalAccount } from 'src/entities/local-account.entity';
import { AuthService } from '../auth/auth.service';
import { RefreshToken } from 'src/entities/refresh-token.entity';
import { TokenService } from '../auth/token.service';
import { JwtService } from '@nestjs/jwt';
import { CacheService } from 'src/modules/redis/cache.service';
import { Address } from 'src/entities/address.entity';
import { TransactionUtil } from 'src/utils/transaction.util';
import { Coin } from 'src/entities/coin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, LocalAccount, RefreshToken, Address, Coin])],
  controllers: [UserController],
  providers: [UserService, AuthService, TokenService, JwtService, CacheService, TransactionUtil],
})
export class UserModule {}
