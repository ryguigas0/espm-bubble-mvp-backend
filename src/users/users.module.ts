import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getMongooseOptions } from 'src/config/mdb-config';
import { User, UserSchema } from './schema/user.schema';
import { UsersMeController } from './users-me.controller';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMongooseOptions,
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController, UsersMeController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
