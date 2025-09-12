import { Body, Controller, Delete, Param, Post, Request } from '@nestjs/common';
import { UserEventsService } from './user-events.service';
import { PushAttendanceDto } from 'src/user-events/dto/push-attendance.dto';
import type { LoggedInReq } from 'src/util/loged-in-req';

@Controller('v1/events/:eventId')
export class UserEventsController {
  constructor(private readonly userEventsService: UserEventsService) {}

  @Post('attendance')
  async pushAttendance(
    @Param('eventId') id: string,
    @Request() req: LoggedInReq,
    @Body() pushAttendanceDto: PushAttendanceDto,
  ) {
    return await this.userEventsService.pushAttendance(
      id,
      req.user.sub,
      pushAttendanceDto,
    );
  }

  @Delete('attendance')
  async removeAttendance(
    @Param('eventId') id: string,
    @Request() req: LoggedInReq,
  ) {
    return await this.userEventsService.removeAttendance(id, req.user.sub);
  }
}
