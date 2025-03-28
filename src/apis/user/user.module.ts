import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { LocalAccount } from 'src/entities/local-account.entity';
import { Address } from 'src/entities/address.entity';
import { RestrictionModule } from '../restriction/restriction.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, LocalAccount, Address]), AuthModule, RestrictionModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
