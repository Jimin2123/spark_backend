import { Controller, Get, UseGuards } from '@nestjs/common';
import { CoinService } from './coin.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('coin')
@ApiBearerAuth()
export class CoinController {
  constructor(private readonly coinService: CoinService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getBalance(@CurrentUser() userId: string) {
    return this.coinService.getBalance(userId);
  }
}
