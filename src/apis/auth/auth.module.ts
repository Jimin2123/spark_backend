import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalAccount } from 'src/entities/local-account.entity';
import { RefreshToken } from 'src/entities/refresh-token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LocalAccount, RefreshToken])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
