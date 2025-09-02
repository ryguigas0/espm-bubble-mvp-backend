import { SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EventDocument = HydratedDocument<Event>;

export class Event {}

export const EventSchema = SchemaFactory.createForClass(Event);
