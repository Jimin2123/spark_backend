import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/entities/dtos/user.dto';
import { LocalAccount } from 'src/entities/local-account.entity';
import { User } from 'src/entities/user.entity';
import { hashPassword } from 'src/utils/hash.util';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(LocalAccount)
    private readonly localAccountRepository: Repository<LocalAccount>,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const { email, username, password } = createUserDto;

    const existingEmail = await this.localAccountRepository.findOne({
      where: { email },
    });
    if (existingEmail) {
      throw new ConflictException('Email is already in use');
    }

    const existingUserName = await this.userRepository.findOne({
      where: { username },
    });
    if (existingUserName) {
      throw new ConflictException('Username is already in use');
    }

    const createdUser = this.userRepository.create(createUserDto);
    const savedUser = await this.userRepository.save(createdUser);

    const hashedPassword = await hashPassword(password);
    const createdLocalAccount = this.localAccountRepository.create({
      email,
      password: hashedPassword,
      user: savedUser,
    });
    return this.localAccountRepository.save(createdLocalAccount);
  }
}
