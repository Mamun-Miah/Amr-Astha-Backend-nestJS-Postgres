import { Controller, Body, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  signup(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.signup(registerUserDto);
  }
}
