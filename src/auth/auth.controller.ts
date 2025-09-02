import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('v1/auth')
export class AuthController {
  constructor(private authservice: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authservice.login(loginDto.id, loginDto.pass);
  }
}
