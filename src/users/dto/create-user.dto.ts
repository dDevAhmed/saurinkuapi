import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from "class-validator";
import { UserRole } from "../enum/userRole.enum";

export class CreateUserDto {
    @IsNotEmpty()
    name: string;
    
    @IsEmail()
    email: string;
    
    @IsOptional()
    password?: string;
    
    @IsEnum(UserRole)
    role: UserRole;
  }