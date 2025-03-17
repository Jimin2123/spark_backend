import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/entities/dtos/user.dto';
import { LocalAccount } from 'src/entities/local-account.entity';
import { User } from 'src/entities/user.entity';
import { hashPassword } from 'src/utils/hash.util';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { CacheService } from 'src/modules/redis/cache.service';
import { Address } from 'src/entities/address.entity';
import { TransactionUtil } from 'src/utils/transaction.util';
import { Coin } from 'src/entities/coin.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(LocalAccount)
    private readonly localAccountRepository: Repository<LocalAccount>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(Coin)
    private readonly coinRepository: Repository<Coin>,
    private readonly authService: AuthService,
    private readonly cacheService: CacheService,
    private readonly transactionUtil: TransactionUtil,
  ) {}

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

    // 유저네임 중복 확인
    const existingUserName = await this.userRepository.findOne({ where: { username } });
    if (existingUserName) {
      throw new ConflictException('Username is already in use');
    }

    // 트랜잭션을 사용하여 사용자, 계정, 주소를 생성
    const user = await this.transactionUtil.runInTransaction(
      async (queryRunner) => {
        // User 생성
        const createdUser = this.userRepository.create(createUserDto);
        const savedUser = await queryRunner.manager.save(createdUser);

        // LocalAccount 생성 (비밀번호 해싱 포함)
        const hashedPassword = await hashPassword(password);
        const createdLocalAccount = this.localAccountRepository.create({
          email,
          password: hashedPassword,
          user: savedUser,
        });
        await queryRunner.manager.save(createdLocalAccount);

        // Address 생성
        const createdAddress = this.addressRepository.create({
          ...createUserDto.address,
          user: savedUser,
        });
        await queryRunner.manager.save(createdAddress);

        const createdCoin = this.coinRepository.create({
          user: savedUser,
        });
        await queryRunner.manager.save(createdCoin);

        return savedUser;
      },
      async (error) => {
        // 롤백 발생 시 추가적인 로깅 처리
        console.error(`❌ User creation transaction failed: ${error.message}`);
      },
    );

    return await this.authService.login({ email, password });
  }

  /**
   * 사용자 ID로 사용자를 찾습니다.
   * @param uid 사용자 ID
   * @param role 사용자 역할
   * @returns 사용자 정보
   */
  async findUserById(uid: string, relations: string[] = []) {
    const cachedUser = await this.cacheService.getCache<User>(uid);
    if (cachedUser) return cachedUser;

    const user = await this.userRepository.findOne({
      where: { uid },
      relations,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.cacheService.setCache(uid, user, 3600);
    return user;
  }
}
