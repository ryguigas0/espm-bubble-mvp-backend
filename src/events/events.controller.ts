import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  Param,
  Patch,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import type { LoggedInReq } from 'src/util/loged-in-req';

@Controller('v1/events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(@Request() req: LoggedInReq, @Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(req.user.sub, createEventDto);
  }

  @Get()
  findAll(@Request() req: LoggedInReq) {
    return this.eventsService.findAll(req.user.data.region);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.eventsService.findOne(id);
  }

  @Patch(':id/cancel')
  async update(@Param('id') id: string, @Request() req: LoggedInReq) {
    return await this.eventsService.cancel(id, req.user.sub);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.eventsService.remove(+id);
  // }
}
