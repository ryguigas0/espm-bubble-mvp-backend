import { BadRequestException, Injectable } from '@nestjs/common';
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
    });

    return events;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} event`;
  // }

  // update(id: number, updateEventDto: UpdateEventDto) {
  //   return `This action updates a #${id} event`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} event`;
  // }
}
