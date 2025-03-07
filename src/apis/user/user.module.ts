import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { LocalAccount } from 'src/entities/local-account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, LocalAccount])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
