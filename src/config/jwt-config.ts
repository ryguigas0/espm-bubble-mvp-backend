import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const getJwtOptions = (
  configService: ConfigService,
): JwtModuleOptions => {
  const secret = configService.getOrThrow<string>('JWT_SECRET');
  const expiresIn = configService.getOrThrow<string>('JWT_EXPIRES');

  return {
    secret,
    signOptions: {
      expiresIn,
    },
  };
};
