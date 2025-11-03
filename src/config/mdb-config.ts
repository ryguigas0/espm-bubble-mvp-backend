import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

export const getMongooseOptions = (
  configService: ConfigService,
): MongooseModuleOptions => {
  const uri = configService.getOrThrow<string>('MONGO_URI');
  const authSource = configService.getOrThrow<string>('MONGO_AUTH_SOURCE');

  return {
    uri,
    authSource,
  };
};
