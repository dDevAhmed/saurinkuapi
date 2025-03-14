import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { CreateOrderDto } from '../dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { PaginationDto } from 'src/common/shared-DTO/pagination.dto';
import { OrderStatus } from '../enum/orderStatus.enum';
import { UpdateOrderStatusDto } from '../dto/update-orderStatus.dto';


@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) //repo injection of Order entity
    private orderRepo: Repository<Order>,

    @InjectRepository(User)  //repo injection of User entity
    private userRepo: Repository<User>,
  ) {}

  //FN TO CREATE AN ORDER
  public async createOrder(
    createOrderDto: CreateOrderDto,
    currentUserId: number,
  ): Promise<Order> {
    // find current user and verify he exist
    const user = await this.userRepo.findOne({
      where: { id: currentUserId },
    });

    if (!user) {
      throw new NotFoundException(`User with id: ${currentUserId} not found`);
    }

    // create the order
    const order = this.orderRepo.create({
      ...createOrderDto,
      userId: currentUserId,
      // orderStatus is set to default 
    });

    return await this.orderRepo.save(order); // save the order in DB
  }

  //FN TO FIND ALL ORDERS
  public async findAll(
    paginationDto: PaginationDto,
  ): Promise<{ orders: Order[]; total: number }> {
    const { page = 1, limits = 10 } = paginationDto;

    const [orders, total] = await this.orderRepo.findAndCount({
      take: limits,
      skip: (page - 1) * limits,
      relations: ['user'],
    });

    return { orders, total };
  }

  //FN TO FIND AN ORDER BY ID
  public async findOne(id: number): Promise<Order> {
    const order = await this.orderRepo.findOne({ //finds the order from DB
      where: { id },
      relations: ['user'],
    });

    if (!order) { //throw error if not found 
      throw new NotFoundException(`Order with id: ${id} not found`);
    }

    return order;  //return the order when found
  }

  //FN TO FIND ORDER BY ORDERID
  public async findByOrderId(orderId: string): Promise<Order> {
    const order = await this.orderRepo.findOne({ //find the order from DB 
      where: { orderId },
      relations: ['user'],
    });

    if (!order) { //throw error if not found 
      throw new NotFoundException(`Order with orderId: ${orderId} not found`);
    }

    return order; //return order when found
  }

  //FN TO FIND A USER'S OVERALL ORDERS
  public async findMyOrders(
    currentUserId: number,
    paginationDto: PaginationDto,
  ): Promise<{ orders: Order[]; total: number }> {
    const { limits = 10, page = 1 } = paginationDto;

    //this enables a user to see all his orders
    const [orders, total] = await this.orderRepo.findAndCount({
      where: { userId: currentUserId },
      relations: ['user'],
      take: limits,
      skip: (page - 1) * limits,
      order: { createdAt: 'DESC' },
    });
    
    return { orders, total };
  }

  //FN TO UPDATE AN ORDER 
  public async updateOrder(
    id: number,
    updateOrderDto: UpdateOrderDto,
    currentUserId: number,
  ): Promise<Order> {
    const order = await this.orderRepo.findOne({  //find the order from the DB
      where: { id },
      relations: ['user'],
    });

    if (!order) { //throw error when order is not found
      throw new NotFoundException(`Order with id: ${id} is not found`);
    }

    // verify user owns this order
    if (order.userId !== currentUserId) {
      throw new UnauthorizedException('You can only update your own orders');
    }

    // Only allow cancellation for pending orders
    if (order.orderStatus !== OrderStatus.Pending) {
      throw new UnauthorizedException(
        'Order can not be updated',
      );
    }

    //merge the update into existing order
    const updatedOrder = this.orderRepo.merge(order, updateOrderDto); 
    return await this.orderRepo.save(updatedOrder); //save the order after update
  }

  //FN TO UPDATE ORDERSTATUS
  public async updateOrderStatus(
    id: number,
    updateStatusDto: UpdateOrderStatusDto,
  ): Promise<Order> {
    const order = await this.orderRepo.findOne({ where: { id } }); //find the order status from DB

    if (!order) { //throw error if not found 
      throw new NotFoundException(`Order with id: ${id} is not found`);
    }

    order.orderStatus = updateStatusDto.orderStatus; //change the status to match the enums
    return await this.orderRepo.save(order);  //save the order 
  }

  //FN TO CANCEL AN ORDER 
  public async cancelOrder(
    id: number,
    currentUserId: number,
  ): Promise<{ message: string }> {
    const order = await this.orderRepo.findOne({ where: { id } }); //find the order from DB

    if (!order) { //throw error if order is not found 
      throw new NotFoundException(`Order with id: ${id} is not found`);
    }

    // verify user owns this order
    if (order.userId !== currentUserId) {
      throw new UnauthorizedException('You can only cancel your own orders');
    }

    // Only allow cancellation for pending orders
    if (order.orderStatus !== OrderStatus.Pending) { //checks if order is still pending
      throw new UnauthorizedException(  //throws an error if order has begun processing
        'Orders can not be cancelled',
      );
    }

    await this.orderRepo.delete(order.id); // cancel order if it's still processing 
    return { message: `Order with id:${id} has been cancelled successfully` }; //send confirmation message 
  }
}
