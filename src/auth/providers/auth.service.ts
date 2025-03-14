import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../users/entities/user.entity';
import { LoginDTO } from '../dto/create-auth.dto';
import { UsersService } from 'src/users/providers/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    private jwtService: JwtService,

    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {}

  //Registration
  async register(registerDTO: CreateUserDto): Promise<Partial<User>> {
    const { name, email, password, role } = registerDTO;

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('Email is already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await this.userRepository.save(newUser);
    return { id: newUser.id, name: newUser.name, email: newUser.email };
  }

  //Login
  async login(
    loginDTO: LoginDTO,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password } = loginDTO;
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate tokens
    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' }); // Shorter expiry for access token
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' }); // Longer expiry for refresh token

    // Store the refresh token in the database
    user.refreshToken = refreshToken;
    await this.userRepository.save(user);

    return { accessToken, refreshToken };
  }

  //Validation
  async validateUser(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  //Refresh Token
  async refreshToken(
    oldRefreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // Find user by refresh token
    const user = await this.userRepository.findOne({
      where: { refreshToken: oldRefreshToken },
    });
    if (!user) throw new UnauthorizedException('Invalid refresh token');

    try {
      const decoded = this.jwtService.verify(oldRefreshToken); // Verify if it's valid
      if (!decoded) throw new UnauthorizedException('Invalid refresh token');
    } catch (error) {
      throw new UnauthorizedException('Refresh token expired');
    }

    // Generate new tokens
    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const newRefreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    // Save new refresh token
    user.refreshToken = newRefreshToken;
    await this.userRepository.save(user);

    return { accessToken, refreshToken: newRefreshToken };
  }

  //LogOut
  async logout(refreshToken: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { refreshToken } });

    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Ensure refreshToken is set to NULL and saved
    user.refreshToken = null;
    await this.userRepository.update(user.id, { refreshToken: null }); // Explicit update
  }
}
