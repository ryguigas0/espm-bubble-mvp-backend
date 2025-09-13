import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ _id: false })
export class EventAttendance {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop()
  probability: number;
}

export const EventAttendanceSchema =
  SchemaFactory.createForClass(EventAttendance);
