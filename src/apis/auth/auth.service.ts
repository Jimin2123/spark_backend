import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LocalAccountDto } from 'src/entities/dtos/auth.dto';
import { LocalAccount } from 'src/entities/local-account.entity';
import { RefreshToken } from 'src/entities/refresh-token.entity';
import { comparePassword } from 'src/utils/hash.util';
import { Repository } from 'typeorm';
import { TokenPayload, Tokens, TokenService } from './token.service';
import { User } from 'src/entities/user.entity';
import { CacheService } from 'src/modules/redis/cache.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(LocalAccount)
    private readonly localAccountRepository: Repository<LocalAccount>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly tokenService: TokenService,
    private readonly cacheService: CacheService,
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

  async refreshTokens(refreshToken: string): Promise<Tokens> {
    // 리프레시 토큰 검증 (변조 여부 체크)
    const payload = this.tokenService.verifyRefreshToken(refreshToken);
    if (!payload) {
      throw new BadRequestException('리프레시 토큰을 갱신할 수 없습니다.');
    }

    const existingToken = await this.refreshTokenRepository.findOne({
      where: { token: refreshToken },
      relations: ['user'],
    });

    if (!existingToken || existingToken.expiresAt < new Date()) {
      if (existingToken) {
        await this.refreshTokenRepository.remove(existingToken);
      }
      throw new BadRequestException('유효하지 않은 리프레시 토큰입니다.');
    }

    return this.generateTokens(existingToken.user);
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

  /**
   * 사용자 로그아웃을 처리합니다.
   * @param userId
   */
  async logout(userId: string, accessToken: string): Promise<void> {
    const checkRefreshToken = await this.refreshTokenRepository.findOne({ where: { user: { uid: userId } } });
    if (!checkRefreshToken) {
      throw new BadRequestException('로그아웃할 수 있는 토큰이 없습니다.');
    }
    await this.refreshTokenRepository.delete({ user: { uid: userId } });

    // 2. Access Token의 남은 유효기간을 계산하여 Redis 블랙리스트에 등록
    try {
      const decodedToken = this.tokenService.verifyAccessToken(accessToken);
      if (!decodedToken || !decodedToken.exp) {
        throw new UnauthorizedException('유효하지 않은 토큰입니다.');
      }

      const currentTime = Math.floor(Date.now() / 1000); // 현재 시간 (초 단위)
      const ttl = decodedToken.exp - currentTime; // 만료 시간 - 현재 시간 = 남은 TTL

      if (ttl > 0) {
        await this.cacheService.setCache(`blacklist:${accessToken}`, 'true', ttl);
      }
    } catch (error) {
      throw new UnauthorizedException('토큰을 파싱하는데 실패했습니다.');
    }
  }
}
