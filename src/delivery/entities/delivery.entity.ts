import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DeliveryStatus } from '../enum/deliveryStatus.enum';
import { Order } from 'src/order/entities/order.entity';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Delivery {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.id, { onDelete: 'CASCADE' })
  order: Order;

  @ManyToOne(() => User, (user) => user.id)
  deliveryAgent: User;

  @Column({
    type: 'enum',
    enum: DeliveryStatus,
    default: DeliveryStatus.PENDING,
  })
  status: DeliveryStatus;

  @Column({ type: 'timestamp', nullable: true })
  pickupTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  deliveryTime: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;
}
