import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CoinService } from './coin.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { SpendCoinDto } from 'src/entities/dtos/coin.dto';
import { SwaggerGetBalance, SwaggerSpendCoin } from 'src/common/docs/coin.swagger';

@Controller('coin')
@ApiBearerAuth()
export class CoinController {
  constructor(private readonly coinService: CoinService) {}

  @Get()
  @SwaggerGetBalance()
  @UseGuards(JwtAuthGuard)
  async getBalance(@CurrentUser() userId: string) {
    return this.coinService.getBalance(userId);
  }

  @Post()
  @SwaggerSpendCoin()
  @UseGuards(JwtAuthGuard)
  async spendCoin(@CurrentUser() userId: string, @Body() spendCoinDto: SpendCoinDto) {
    return this.coinService.spendCoin(userId, spendCoinDto);
  }
}
