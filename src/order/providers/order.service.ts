import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { CreateOrderDto } from '../dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { PaginationDto } from 'src/common/shared-DTO/pagination.dto';
import { OrderStatus } from '../enum/orderStatus.enum';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) // repo injection of orders entity
    private orderRepo: Repository<Order>,

    @InjectRepository(User) //repo injection of users entity
    private userRepo: Repository<User>,
  ) {}

  //THIS FN CREATES AN ORDER
  public async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const customer = await this.userRepo.findOne({
      //finds a customer in the DB
      where: { id: createOrderDto.customerId },
    });
    if (!customer) {
      //throw an error if customer is not found
      throw new NotFoundException('Customer not found');
    }

    let deliveryAgent: User | null = null; // setUp a delivery agent
    if (createOrderDto.deliveryAgentId) {
      deliveryAgent = await this.userRepo.findOne({
        //find the delivery agent from the DB
        where: { id: createOrderDto.deliveryAgentId },
      });
      if (!deliveryAgent) {
        //throw an error if delivery agent is not found
        throw new NotFoundException('Delivery agent not found');
      }
    }
    const order = this.orderRepo.create(createOrderDto); //create an order

    return await this.orderRepo.save(order); // save the order in the DB
  }

  // THIS FN FINDS ALL ORDERS WITH PAGINATION
  public async findAll(
    paginationDto: PaginationDto,
  ): Promise<{ orders: Order[]; total: number }> {
    const { page = 1 , limits = 10 } = paginationDto;
    // Find the orders and count them
    const [orders, total] = await this.orderRepo.findAndCount({
      take: limits,
      skip: (page - 1) * limits,
    });
    return { orders, total }; // returns the orders and the total number of orders
  }

  //THIS FN FETCHES ORDER DETAILS BY ID
  public async findOne(id: number): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['customer'],
    });
    if (!order) {
      throw new NotFoundException(`order with id: ${id} not found`);
    }
    return order;
  }

  //THIS FN RETRIEVES ORDERS BY A CUSTOMER
  public async findOrdersByCustomer(
    customerId: number,
    paginationDto: PaginationDto,
  ): Promise<{ orders: Order[]; total: number }> {
    const customer = await this.userRepo.findOne({
      where: { id: customerId },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with id: ${customerId} not found`);
    }

    const { limits = 10, page = 1 } = paginationDto;

    const [orders, total] = await this.orderRepo.findAndCount({
      where: { customer: { id: customerId } },
      relations: ['user'],
      take: limits,
      skip: (page - 1) * limits,
    });

    return { orders, total };
  }

  // THIS UPDATES AN ORDER BY IT'S STATUS
  public async updateOrder(id: number, status: OrderStatus): Promise<Order> {
    // finds order to be updated from the DB
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) {
      //throws an error if order is not found
      throw new NotFoundException(`order with id: ${id} is not found`);
    }
    order.status = status; //sets new order status
    return await this.orderRepo.save(order); //save the updated order status
  }

  //THIS FN CANCELS AN ORDER
  public async cancelOrder(id: number): Promise<{ message: string }> {
    const order = await this.orderRepo.findOne({ where: { id } });

    if (!order) {
      throw new NotFoundException(`order with id: ${id} is not found `);
    }

    await this.orderRepo.delete(order.id);
    return { message: `Order with id:${id} has been cancelled successfully` };
  }
}
