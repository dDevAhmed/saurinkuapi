import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  UseGuards, 
  Req, 
  Res, 
  UnauthorizedException 
} from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { RegisterDTO, LoginDTO } from './dto/create-auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthenticatedRequest } from './interfaces/request.interface';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDTO: RegisterDTO) {
    return this.authService.register(registerDTO);
  }

  @Post('login')
  async login(
    @Body() loginDTO: LoginDTO,
    @Res({ passthrough: true }) response: Response
  ) {
    const { accessToken, refreshToken } = await this.authService.login(loginDTO);

    response.cookie('refresh_token', refreshToken, {
      httpOnly: true, // Prevents client-side access
      secure: process.env.NODE_ENV === 'production', // Secure in production
      sameSite: 'strict',
    });

    return { accessToken };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: AuthenticatedRequest) {
    return req.user;
  }

  @Post('refresh')
  async refreshToken(@Req() req, @Res({ passthrough: true }) response: Response) {
    const oldRefreshToken = req.cookies['refresh_token'];
    if (!oldRefreshToken) throw new UnauthorizedException('No refresh token provided');

    const { accessToken, refreshToken } = await this.authService.refreshToken(oldRefreshToken);

    // Set new refresh token in cookies
    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return { accessToken };
  }

  @Post('logout')
  async logout(@Body('refreshToken') refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    await this.authService.logout(refreshToken);

    return { message: 'Logged out successfully' };
  }
}
