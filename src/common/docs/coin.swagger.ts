import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { Coin } from 'src/entities/coin.entity';
import { SpendCoinDto } from 'src/entities/dtos/coin.dto';

export function SwaggerSpendCoin() {
  return applyDecorators(
    ApiOperation({
      summary: '코인 사용 API',
      description: '사용자의 코인을 사용하고, 코인 변동 내역을 저장합니다.',
    }),
    ApiBody({
      description: '코인 사용 정보',
      type: SpendCoinDto,
    }),
    ApiResponse({
      status: 200,
      description: '코인 사용 성공',
      type: Coin,
    }),
    ApiForbiddenResponse({
      description: '잔액이 부족합니다.',
    }),
    ApiNotFoundResponse({
      description: '코인을 찾을 수 없습니다.',
    }),
  );
}

export function SwaggerGetBalance() {
  return applyDecorators(
    ApiOperation({ summary: '코인 잔액 조회', description: '사용자의 코인 잔액을 조회합니다.' }),
    ApiResponse({ status: 200, description: '성공적으로 잔액을 조회했습니다.', schema: { example: 1000 } }),
    ApiNotFoundResponse({ description: '사용자를 찾을 수 없습니다.' }),
  );
}
