import { IsEnum, IsNotEmpty } from "class-validator";
import { DeliveryStatus } from "../enum/deliveryStatus.enum";

export class CreateDeliveryDto {
    @IsNotEmpty()
    orderId: number;
    
    @IsNotEmpty()
    deliveryAgentId: number;
    
    @IsEnum(DeliveryStatus)
    status: DeliveryStatus;
  }