import { User } from 'src/users/schema/user.schema';

export class TokenPayloadDto {
  sub: string;
  data: Omit<User, 'passwordHash'>;
}
