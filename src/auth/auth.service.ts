import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async login(userId: string, pass: string) {
    const user = await this.usersService.findOne(userId);

    if (!user) throw new UnauthorizedException('User not found');

    const cmp = await bcrypt.compare(pass, user.passwordHash);

    if (!cmp) throw new UnauthorizedException('Wrong password');

    const { passwordHash, ...result } = user.toObject();
    // TODO: Generate a JWT and return it here
    // instead of the user object
    return result;
  }
}
