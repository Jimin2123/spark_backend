import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAccountDto } from 'src/entities/dtos/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() localAccountDto: LocalAccountDto) {
    return await this.authService.login(localAccountDto);
  }
}
