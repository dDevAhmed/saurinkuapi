import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { UserRole } from "../enum/userRole.enum";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  name: string;
  
  @Column({ unique: true })
  email: string;
  
  @Column()
  password: string;
  
  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;
}
