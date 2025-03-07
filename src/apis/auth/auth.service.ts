import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LocalAccountDto } from 'src/entities/dtos/auth.dto';
import { LocalAccount } from 'src/entities/local-account.entity';
import { RefreshToken } from 'src/entities/refresh-token.entity';
import { comparePassword } from 'src/utils/hash.util';
import { Repository } from 'typeorm';
import { TokenPayload, Tokens, TokenService } from './token.service';
import { User } from 'src/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(LocalAccount)
    private readonly localAccountRepository: Repository<LocalAccount>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly tokenService: TokenService,
  ) {}

  /**
   * 사용자 로그인을 처리합니다.
   * @param localAccountDto 로그인 시 필요한 이메일과 비밀번호
   * @returns 새롭게 생성된 액세스 토큰과 리프레시 토큰
   */
  async login(localAccountDto: LocalAccountDto): Promise<Tokens> {
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

    return this.generateTokens(localAccount.user);
  }

  /**
   * 사용자 로그인 시 액세스 토큰과 리프레시 토큰을 생성합니다.
   * @param user 로그인된 사용자
   * @returns 새롭게 생성된 액세스 토큰과 리프레시 토큰
   */
  private async generateTokens(user: User): Promise<Tokens> {
    try {
      // 토큰에 포함할 페이로드 생성
      const tokenPayload: TokenPayload = { sub: user.uid, role: user.role };

      // 새로운 액세스 토큰 생성
      const accessToken = this.tokenService.generateAccessToken(tokenPayload);

      // 새로운 리프레시 토큰 생성 또는 기존 토큰 갱신
      const refreshToken = await this.createOrUpdateRefreshToken(user, tokenPayload);

      return { accessToken, refreshToken };
    } catch (e) {
      console.error('토큰 생성 중 에러 발생:', e);
      throw new InternalServerErrorException('토큰 생성 중 문제가 발생했습니다.');
    }
  }

  /**
   * 리프레시 토큰을 생성하거나 기존 토큰을 갱신합니다.
   * @param user 대상 사용자
   * @param payload 토큰 페이로드
   * @returns 새로 생성된 리프레시 토큰
   */
  private async createOrUpdateRefreshToken(user: User, payload: TokenPayload): Promise<string> {
    const newRefreshToken = this.tokenService.generateRefreshToken(payload);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7일 후 만료

    // 기존 토큰이 있으면 업데이트, 없으면 새로 생성
    await this.refreshTokenRepository.upsert(
      {
        user,
        token: newRefreshToken,
        expiresAt,
      },
      ['user'], // 중복 방지: 동일한 user에 대한 토큰을 업데이트
    );

    return newRefreshToken;
  }
}
