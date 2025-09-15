import { Body, Controller, Delete, Param, Post, Request } from '@nestjs/common';
import { UserEventsService } from './user-events.service';
import { PushAttendanceDto } from 'src/user-events/dto/push-attendance.dto';
import type { LoggedInReq } from 'src/util/loged-in-req';
import { CoordsDto } from './dto/coords.dto';

@Controller('v1/events/:eventId')
export class UserEventsController {
  constructor(private readonly userEventsService: UserEventsService) {}

  @Post('attendance')
  async pushAttendance(
    @Param('eventId') eventId: string,
    @Request() req: LoggedInReq,
    @Body() pushAttendanceDto: PushAttendanceDto,
  ) {
    return await this.userEventsService.pushAttendance(
      eventId,
      req.user.sub,
      pushAttendanceDto,
    );
  }

  @Delete('attendance')
  async removeAttendance(
    @Param('eventId') eventId: string,
    @Request() req: LoggedInReq,
  ) {
    return await this.userEventsService.removeAttendance(eventId, req.user.sub);
  }

  @Post('checkin')
  async checkIn(
    @Param('eventId') eventId: string,
    @Request() req: LoggedInReq,
    @Body() checkInDto: CoordsDto,
  ) {
    return await this.userEventsService.checkIn(
      eventId,
      req.user.sub,
      checkInDto,
    );
  }

  @Post('checkout')
  async checkOut(
    @Param('eventId') eventId: string,
    @Request() req: LoggedInReq,
    @Body() checkInDto: CoordsDto,
  ) {
    return await this.userEventsService.checkOut(
      eventId,
      req.user.sub,
      checkInDto,
    );
  }
}
