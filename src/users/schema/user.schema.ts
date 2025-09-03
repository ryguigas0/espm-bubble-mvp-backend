import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import {
  Coordinates,
  CoordinatesSchema,
} from 'src/util/schemas/coordinates.schema';
import { Attendance } from './attendance.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({
  collection: 'users',
})
export class User {
  @Prop({
    required: true,
    trim: true,
  })
  name: string;

  @Prop({
    required: true,
    validate: (input: string) => {
      const emailRegex =
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;

      return emailRegex.test(input);
    },
  })
  email: string;

  @Prop({ default: 'GRANDE-SP' })
  region: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: false })
  profileImageURL?: string;

  @Prop({ type: CoordinatesSchema, required: false, index: '2dsphere' })
  coords?: Coordinates;

  @Prop({
    required: true,
    validate: (arr: number[]) => {
      arr.every((v) => v >= 1 && v <= 5);
    },
  })
  embeddings: number[];

  @Prop({ type: [Attendance] })
  attendance: Attendance[];

  @Prop({
    required: true,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  })
  blockedUsers: string[];

  @Prop({
    required: true,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  })
  friends: Types.ObjectId[];

  @Prop({
    type: Date,
  })
  deletedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
