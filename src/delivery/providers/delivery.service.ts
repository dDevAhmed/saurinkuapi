import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Delivery } from '../entities/delivery.entity';
import { DeliveryStatus } from '../enum/deliveryStatus.enum';
import { Order } from 'src/order/entities/order.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectRepository(Delivery)
    private readonly deliveryRepo: Repository<Delivery>,
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  // Assign a delivery agent to an order
  async assignDeliveryAgent(orderId: number, deliveryAgentId: number) {
    const order = await this.orderRepo.findOne({ where: { id: orderId } });
    if (!order) throw new NotFoundException(`Order ${orderId} not found`);

    const agent = await this.userRepo.findOne({
      where: { id: deliveryAgentId },
    });
    if (!agent)
      throw new NotFoundException(`Agent ${deliveryAgentId} not found`);

    const delivery = this.deliveryRepo.create({
      order,
      deliveryAgent: agent,
      status: DeliveryStatus.PENDING,
    });

    return await this.deliveryRepo.save(delivery);
  }

  // Get deliveries assigned to an agent
  async getDeliveriesForAgent(agentId: number) {
    return await this.deliveryRepo.find({
      where: { deliveryAgent: { id: agentId } },
      relations: ['order', 'deliveryAgent'],
    });
  }

  // Update delivery status
  async updateDeliveryStatus(deliveryId: number, status: DeliveryStatus) {
    const delivery = await this.deliveryRepo.findOne({
      where: { id: deliveryId },
    });
    if (!delivery)
      throw new NotFoundException(`Delivery ${deliveryId} not found`);

    delivery.status = status;
    return await this.deliveryRepo.save(delivery);
  }

  // Retrieve delivery history for a customer
  async getDeliveryHistory(customerId: number) {
    return await this.deliveryRepo.find({
      where: { order: { customer: { id: customerId } } },
      relations: ['order', 'deliveryAgent'],
    });
  }
}
