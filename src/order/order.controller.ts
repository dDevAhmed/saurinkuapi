import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  UseGuards,
  Req,
  Patch,
} from '@nestjs/common';

import { PaginationDto } from 'src/common/shared-DTO/pagination.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Role } from 'src/common/enums/usersRole.enum';
import { RolesGuard } from 'src/auth/guards/role-guard/role.guard';
import { RoleDecorator } from 'src/auth/decorators/role.decorator';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UpdateOrderStatusDto } from './dto/update-orderStatus.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './providers/order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post() //route to create an Order
  @UseGuards(JwtAuthGuard)
  create(@Body() createOrderDto: CreateOrderDto, @Req() req) {
    return this.orderService.createOrder(createOrderDto, req.user.id);
  }

  @Get() //route to all Orders
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RoleDecorator(Role.Admin, Role.Agent)
  findAll(@Query() paginationDto: PaginationDto) {
    return this.orderService.findAll(paginationDto);
  }

  @Get('my-orders') //route for user to get his orders
  @UseGuards(JwtAuthGuard)
  findMyOrders(@Query() paginationDto: PaginationDto, @Req() req) {
    return this.orderService.findMyOrders(req.user.id, paginationDto);
  }

  @Get(':id') //route to get an Order by ID
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @Get(':orderId') //route to get an Order by tracking ID
  @UseGuards(JwtAuthGuard)
  findByOrderId(@Param('orderId') orderId: string) {
    return this.orderService.findByOrderId(orderId);
  }

  @Patch(':id') //route to update an order
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @Req() req,
  ) {
    return this.orderService.updateOrder(+id, updateOrderDto, req.user.id);
  }

  @Patch(':id/status') // route to update order status 
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RoleDecorator(Role.Admin, Role.Agent)
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateOrderStatusDto,
  ) {
    return this.orderService.updateOrderStatus(+id, updateStatusDto);
  }

  @Delete(':id') //route to delete/cancel an order 
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Req() req) {
    return this.orderService.cancelOrder(+id, req.user.id);
  }
}
