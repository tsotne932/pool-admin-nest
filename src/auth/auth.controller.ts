import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() data: any) {
    try {
      return await this.authService.register(data.data);
    } catch (error) {
      return { error: error.message };
    }
  }

  @Public()
  @Post('login')
  async login(@Body() data: any) {
    try {
      return await this.authService.login(data.data);
    } catch (error) {
      return { error: error.message };
    }
  }

  @Public()
  @Post('logout')
  logout() {
    return {};
  }
}
