import { Module } from '@nestjs/common';
import { PaymentService } from './providers/payment.service';
import { PaymentController } from './payment.controller';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
