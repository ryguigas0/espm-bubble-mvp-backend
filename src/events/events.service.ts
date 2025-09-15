import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Event } from './schemas/event.schema';
import { Model } from 'mongoose';

@Injectable()
export class EventsService {
  constructor(@InjectModel(Event.name) private eventModel: Model<Event>) {}

  async create(ownerId: string, createEventDto: CreateEventDto) {
    const { lat, lon, startsAt, endsAt, address, name } = createEventDto;

    if (!name) throw new BadRequestException('Missing event name');

    if (!address) throw new BadRequestException('Missing event address');

    if (!lat || !lon) throw new BadRequestException('No coordinates provided');

    const parsedStartsAt = Date.parse(createEventDto.startsAt);

    if (!parsedStartsAt) throw new BadRequestException('Invalid start date');

    const parsedEndsAt = Date.parse(createEventDto.endsAt);

    if (!parsedEndsAt) throw new BadRequestException('Invalid start date');

    if (startsAt >= endsAt)
      throw new BadRequestException(
        'Start date cannot be the same of after the end date',
      );

    const embeddings = new Array(10)
      .fill(1)
      .map(() => Math.ceil(Math.random() * 4 + 1));

    const event = await this.eventModel.create({
      embeddings,
      name,
      address,
      owner: ownerId,
      startsAt: parsedEndsAt,
      endsAt: parsedEndsAt,
      coords: {
        coordinates: [lon, lat],
      },
    });

    return event;
  }

  async findAll(region: string) {
    const nowTimestamp = new Date();

    const events = await this.eventModel.find({
      region: region,
      endsAt: {
        $gt: nowTimestamp,
      },
      canceledAt: null,
    });

    return events;
  }

  async findOne(id: string) {
    const event = await this.eventModel.findById(id);

    if (!event) throw new NotFoundException('Event not found');

    return event;
  }

  async pushAttendance(eventId: string, userId: string, probability: number) {
    const event = await this.findOne(eventId);

    const result = await this.eventModel.updateOne(
      { _id: event._id },
      {
        $addToSet: {
          attendance: {
            userId,
            probability,
          },
        },
      },
    );

    return result.acknowledged;
  }

  async removeAttendance(eventId: string, userId: string) {
    const event = await this.findOne(eventId);

    if (event.attendance.every((a) => a.userId.toString() !== userId))
      throw new BadRequestException(userId + ' was not attending the event');

    const result = await this.eventModel.updateOne(
      { _id: event._id },
      {
        $pull: {
          attendance: {
            userId,
          },
        },
      },
    );

    return result.acknowledged;
  }

  async cancel(eventId: string, userId: string) {
    console.log({ eventId, userId });
    const event = await this.findOne(eventId);

    if (event.owner.toString() !== userId)
      throw new UnauthorizedException(
        'Only the event owner can update the event',
      );

    await this.eventModel.updateOne(
      {
        _id: event._id,
      },
      {
        canceledAt: new Date(),
      },
    );

    return { message: 'Event canceled' };
  }
}
