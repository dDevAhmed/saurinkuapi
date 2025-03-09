import { Module } from '@nestjs/common';
import { OrderService } from './providers/order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Order } from './entities/order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Order])
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService]
})
export class OrderModule {}
