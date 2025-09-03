import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { TokenPayloadDto } from './dto/token-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) throw new UnauthorizedException('User not found');

    const cmp = await bcrypt.compare(pass, user.passwordHash);

    if (!cmp) throw new UnauthorizedException('Wrong password');

    const { passwordHash, _id, ...result } = user.toObject();

    const payload: TokenPayloadDto = {
      sub: _id.toString(),
      data: result,
    };

    return {
      token: await this.jwtService.signAsync(payload),
    };
  }
}
