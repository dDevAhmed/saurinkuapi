import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateOrderDto {
    @IsNotEmpty()
    customerId: number;
    
    @IsOptional()
    deliveryAgentId?: number;
  }