import { Body, Controller, Get, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAccountDto } from 'src/entities/dtos/auth.dto';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() localAccountDto: LocalAccountDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken } = await this.authService.login(localAccountDto);
    // refreshToken 쿠키 설정
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return { accessToken };
  }

  @Post('refresh-tokens')
  async refreshTokens(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const getRefreshToken = req.cookies['refreshToken'];
    if (!getRefreshToken) {
      throw new UnauthorizedException('리프레시 토큰이 존재하지 않습니다.');
    }

    const { accessToken, refreshToken } = await this.authService.refreshTokens(getRefreshToken);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7일 동안 유지
    });

    return { accessToken };
  }
}
