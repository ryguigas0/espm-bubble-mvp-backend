import { User } from 'src/users/schema/user.schema';

export class TokenPayloadDto {
  sub: string;
  data: Partial<Omit<User, 'passwordHash'>>;
}
