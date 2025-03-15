import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/entities/dtos/user.dto';
import { LocalAccount } from 'src/entities/local-account.entity';
import { User } from 'src/entities/user.entity';
import { hashPassword } from 'src/utils/hash.util';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(LocalAccount)
    private readonly localAccountRepository: Repository<LocalAccount>,
    private readonly authService: AuthService,
    private readonly redisService: RedisService,
  ) {}

  async cacheData(): Promise<void> {
    await this.redisService.set('test-key', 'Hello, Redis!', 60); // 60초 TTL 설정
  }

  async getData(): Promise<string | null> {
    return this.redisService.get('test-key');
  }

  /**
   * 사용자를 생성하고 로그인 합니다.
   * @param createUserDto 사용자 생성 정보
   * @returns
   */
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
    await this.localAccountRepository.save(createdLocalAccount);

    return this.authService.login({ email, password });
  }

  /**
   * 사용자 ID로 사용자를 찾습니다.
   * @param uid 사용자 ID
   * @param role 사용자 역할
   * @returns 사용자 정보
   */
  async findUserById(uid: string, role?: string) {
    const user = await this.userRepository.findOne({
      where: { uid },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
