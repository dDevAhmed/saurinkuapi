import { Controller, Post, Get, Patch, Param, Body } from '@nestjs/common';
import { DeliveryService } from './providers/delivery.service';
import { DeliveryStatus } from './enum/deliveryStatus.enum';

@Controller('delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Post('assign')
  async assignDeliveryAgent(
    @Body() body: { orderId: number; deliveryAgentId: number },
  ) {
    return await this.deliveryService.assignDeliveryAgent(
      body.orderId,
      body.deliveryAgentId,
    );
  }

  @Get('agent/:agentId')
  async getDeliveriesForAgent(@Param('agentId') agentId: number) {
    return await this.deliveryService.getDeliveriesForAgent(agentId);
  }

  @Patch('status/:deliveryId')
  async updateDeliveryStatus(
    @Param('deliveryId') deliveryId: number,
    @Body() body: { status: DeliveryStatus },
  ) {
    return await this.deliveryService.updateDeliveryStatus(
      deliveryId,
      body.status,
    );
  }

  @Get('history/:customerId')
  async getDeliveryHistory(@Param('customerId') customerId: number) {
    return await this.deliveryService.getDeliveryHistory(customerId);
  }
}
