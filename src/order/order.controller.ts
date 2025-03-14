import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OrderService } from './providers/order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { PaginationDto } from 'src/common/shared-DTO/pagination.dto';
import { OrderStatus } from './enum/orderStatus.enum';

@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService, //dependency injection of orderService
  ) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(createOrderDto);
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  findAll(@Query() pagination: PaginationDto) {
    return this.orderService.findAll(pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: OrderStatus) {
    return this.orderService.updateOrder(+id, status);
  }

  @Delete(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.orderService.cancelOrder(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
  //   return this.orderService.update(+id, updateOrderDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.orderService.remove(+id);
  // }
}
