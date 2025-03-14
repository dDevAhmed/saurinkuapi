import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import { OrderStatus } from '../enum/orderStatus.enum';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  orderId: string;

  @ManyToOne(() => User)
  @JoinColumn({
    name: 'userId',
  })
  user: User;

  @Column()
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    type: 'text',
  })
  description: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  pickupTime: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  deliveryTime: Date;

  @Column({
    type: 'date',
    nullable: true,
  })
  pickupDate: Date;

  @Column({
    type: 'date',
    nullable: true,
  })
  deliveryDate: Date;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.Pending,
  })
  orderStatus: OrderStatus;

  @BeforeInsert()
  generateOrderId() {
    // this generate a random 6-digit number
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    this.orderId = `#${randomDigits}`;
  }
}
