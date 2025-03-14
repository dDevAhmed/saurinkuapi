import { IsEnum, IsNotEmpty } from "class-validator";
import { OrderStatus } from "../enum/orderStatus.enum";

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus, { message: 'not a valid order status' })
  @IsNotEmpty()
  orderStatus: OrderStatus;
}