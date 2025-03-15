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
import { RedisService } from 'src/redis/redis.service';
import { CacheService } from 'src/redis/cache.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, LocalAccount, RefreshToken])],
  controllers: [UserController],
  providers: [UserService, AuthService, TokenService, JwtService, CacheService],
})
export class UserModule {}
