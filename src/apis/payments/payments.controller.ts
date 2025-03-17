import { Body, Controller, Get, Post, Query, Res, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { TossPaymentDto } from 'src/entities/dtos/payments.dto';
import { Response } from 'express';

@Controller('payments')
@ApiBearerAuth()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('/toss/request')
  @UseGuards(JwtAuthGuard)
  async requestPayment(@CurrentUser() userId: string, @Body() tossPaymentDto: TossPaymentDto) {
    const result = await this.paymentsService.createTossPayment(userId, tossPaymentDto);
    return { result };
  }

  @Get('/toss/success')
  async handlePaymentSuccess(
    @Query('paymentKey') paymentKey: string,
    @Query('orderId') orderId: string,
    @Query('amount') amount: number,
    @Res() res: Response,
  ) {
    try {
      // 결제 승인 요청
      const paymentResult = await this.paymentsService.aprroveTossPayment(paymentKey, orderId, amount);

      // 프론트엔드로 결제 결과 전달
      res.redirect(`http://localhost:4000/payment-success?orderId=${orderId}`);
    } catch (error) {
      // 에러 처리 로직 추가
      res.redirect(`http://localhost/payment-fail?orderId=${orderId}`);
    }
  }

  @Get('/toss/fail')
  handlePaymentFail(
    @Query('code') code: string,
    @Query('message') message: string,
    @Query('orderId') orderId: string,
    @Res() res: Response,
  ) {
    // 실패 원인 로깅 또는 처리 로직 추가
    console.error(`결제 실패 - 코드: ${code}, 메시지: ${message}, 주문 ID: ${orderId}`);

    // 프론트엔드로 실패 결과 전달
    res.redirect(`http://localhost:4000/payment-fail?orderId=${orderId}&message=${message}`);
  }
}
