import { IsEnum, IsNotEmpty, IsOptional } from "class-validator";
import { OrderStatus } from "../enum/orderStatus.enum";

export class CreateOrderDto {
    @IsNotEmpty()
    customerId: number;
    
    @IsOptional()
    deliveryAgentId?: number;

    @IsNotEmpty()
    @IsEnum(OrderStatus)
    status: OrderStatus
  }