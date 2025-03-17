import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { TossPaymentDto } from 'src/entities/dtos/payments.dto';

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
}
