import { NestMiddleware, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CacheService } from 'src/modules/redis/cache.service';

@Injectable()
export class BlacklistMiddleware implements NestMiddleware {
  constructor(private readonly caheService: CacheService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(); // Access Token이 없는 경우 미들웨어 통과 (필수)
    }
    const accessToken = authHeader.split(' ')[1];

    if (accessToken) {
      const isBlacklisted = await this.caheService.getCache(`blacklist:${accessToken}`);
      if (isBlacklisted) {
        throw new UnauthorizedException('이 토큰은 로그아웃되어 사용할 수 없습니다.');
      }
    }
    next();
  }
}
