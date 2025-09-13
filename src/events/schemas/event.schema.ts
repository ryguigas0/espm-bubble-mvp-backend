import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import {
  Coordinates,
  CoordinatesSchema,
} from 'src/util/schemas/coordinates.schema';
import { EventAttendance } from './event-attendance.schema';

export type EventDocument = HydratedDocument<Event>;

@Schema({ timestamps: true, collection: 'events' })
export class Event {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, default: 'GRANDE-SP' })
  region: string;

  @Prop({
    required: true,
    validate: (arr: number[]) => {
      arr.every((v) => v >= 1 && v <= 5);
    },
  })
  embeddings: number[];

  @Prop({ type: Date, required: true })
  startsAt: Date;

  @Prop({ type: Date, required: true })
  endsAt: Date;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  owner: Types.ObjectId;

  @Prop({ required: true })
  address: string;

  @Prop({ type: CoordinatesSchema, required: true, index: '2dsphere' })
  coords: Coordinates;

  @Prop({ type: [EventAttendance] })
  attendance: EventAttendance[];
}

export const EventSchema = SchemaFactory.createForClass(Event);
