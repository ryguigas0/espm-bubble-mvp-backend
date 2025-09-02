import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

export const getMongooseOptions = (
  configService: ConfigService,
): MongooseModuleOptions => {
  const user = configService.getOrThrow<string>('MONGO_USER');
  const pass = configService.getOrThrow<string>('MONGO_PASS');
  const host = configService.getOrThrow<string>('MONGO_HOST');
  const port = configService.getOrThrow<number>('MONGO_PORT');
  const db = configService.getOrThrow<string>('MONGO_DB');
  const authSource = configService.getOrThrow<string>('MONGO_AUTH_SOURCE');

  const uri = `mongodb://${user}:${pass}@${host}:${port}/${db}`;

  return {
    uri,
    authSource,
  };
};
