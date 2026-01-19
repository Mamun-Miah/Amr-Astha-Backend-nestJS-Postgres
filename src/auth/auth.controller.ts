import { Controller, Body, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  signup(@Body() dto: RegisterUserDto) {
    return this.authService.signup(dto);
  }

  @Post('login')
  signin(@Body() dto: LoginUserDto) {
    return this.authService.signin(dto);
  }
}
