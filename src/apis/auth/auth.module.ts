import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalAccount } from 'src/entities/local-account.entity';
import { RefreshToken } from 'src/entities/refresh-token.entity';
import { TokenService } from './token.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { jwtConfig } from 'src/configs/jwt.config';
import { JwtStrategy } from 'src/common/guards/passports/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([LocalAccount, RefreshToken]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: jwtConfig,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenService, JwtStrategy],
})
export class AuthModule {}
