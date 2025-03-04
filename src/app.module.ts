import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { DeliveryModule } from './delivery/delivery.module';
import { PaymentModule } from './payment/payment.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [UsersModule, AuthModule, OrderModule, DeliveryModule, PaymentModule, NotificationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
