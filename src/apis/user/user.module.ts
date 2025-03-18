import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { LocalAccount } from 'src/entities/local-account.entity';
import { Address } from 'src/entities/address.entity';
import { Coin } from 'src/entities/coin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, LocalAccount, Address, Coin]), AuthModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
