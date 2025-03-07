import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LocalAccountDto } from 'src/entities/dtos/auth.dto';
import { LocalAccount } from 'src/entities/local-account.entity';
import { RefreshToken } from 'src/entities/refresh-token.entity';
import { comparePassword } from 'src/utils/hash.util';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(LocalAccount)
    private readonly localAccountRepository: Repository<LocalAccount>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async login(localAccountDto: LocalAccountDto) {
    const { email, password } = localAccountDto;

    const localAccount = await this.localAccountRepository.findOne({
      where: { email },
      relations: ['user'],
    });

    if (!localAccount) {
      throw new BadRequestException('등록되지 않은 이메일 혹은 틀린 비밀번호입니다.');
    }

    // 패스워드 검증
    const isPasswordValid = await comparePassword(password, localAccount.password);
    if (!isPasswordValid) {
      throw new BadRequestException('등록되지 않은 이메일 혹은 틀린 비밀번호입니다.');
    }

    return localAccount.user;
  }
}
