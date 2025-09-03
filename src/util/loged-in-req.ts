import { Request } from 'express';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';

export interface LoggedInReq extends Request {
  user: TokenPayloadDto;
}
