import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;
  
  @ManyToOne(() => User)
  customer: User;
  
  @ManyToOne(() => User, { nullable: true })
  deliveryAgent: User;
  
  @Column()
  status: string;
}
