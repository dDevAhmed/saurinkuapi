import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderStatus } from "../enum/orderStatus.enum";

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;
  
  @ManyToOne(() => User)   //this field needs correction
  customer: User;
  
  @ManyToOne(() => User, { nullable: true })
  deliveryAgent: User;
  
  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.Pending,
  })
  status: OrderStatus;
}
