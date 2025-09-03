import { User } from 'src/users/schema/user.schema';

export class TokenPayloadDto {
  sub: string;
  data: Pick<User, 'name' | 'email' | 'region' | 'embeddings'>;
}
