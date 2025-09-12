import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  Param,
  Delete,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import type { LoggedInReq } from 'src/util/loged-in-req';
import { PushAttendanceDto } from './dto/push-attendance.dto';

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

  @Post(':eventId/attendance')
  async pushAttendance(
    @Param('eventId') id: string,
    @Request() req: LoggedInReq,
    @Body() pushAttendanceDto: PushAttendanceDto,
  ) {
    return await this.eventsService.pushAttendance(
      id,
      req.user.sub,
      pushAttendanceDto,
    );
  }

  @Delete(':eventId/attendance')
  async removeAttendance(
    @Param('eventId') id: string,
    @Request() req: LoggedInReq,
  ) {
    return await this.eventsService.removeAttendance(id, req.user.sub);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
  //   return this.eventsService.update(+id, updateEventDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.eventsService.remove(+id);
  // }
}
