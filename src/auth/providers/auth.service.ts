import { Injectable, BadRequestException, UnauthorizedException, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../users/entities/user.entity';
import { RegisterDTO, LoginDTO } from '../dto/create-auth.dto';
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,

    @Inject(forwardRef(() => UsersService))
    private readonly userServive: UsersService
  ) {}

  async register(registerDTO: RegisterDTO): Promise<Partial<User>> {
    const { name, email, password} = registerDTO;

    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('Email is already in use');
    }

    const newUser = this.userRepository.create({ name, email, password });
    await this.userRepository.save(newUser);
    return { id: newUser.id, name: newUser.name, email: newUser.email };
  }

  async login(loginDTO: LoginDTO): Promise<{ accessToken: string }> {
    const { email, password } = loginDTO;
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  async validateUser(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    return user;
  }
}
