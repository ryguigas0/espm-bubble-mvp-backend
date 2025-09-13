import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';

@Schema({ _id: false })
export class UserAttendance {
  @Prop({ required: true, min: 0, max: 100 })
  probability: number;

  @Prop({ required: true, default: false })
  checkedIn: boolean;

  @Prop({ required: true, default: false })
  checkedOut: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true })
  eventId: Types.ObjectId;
}

export const AttendanceSchema = SchemaFactory.createForClass(UserAttendance);
