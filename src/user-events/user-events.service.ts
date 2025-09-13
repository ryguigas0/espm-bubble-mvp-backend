import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { EventsService } from 'src/events/events.service';
import { PushAttendanceDto } from './dto/push-attendance.dto';

@Injectable()
export class UserEventsService {
  constructor(
    private usersService: UsersService,
    private eventService: EventsService,
  ) {}

  async pushAttendance(
    eventId: string,
    userId: string,
    pushAttendanceDto: PushAttendanceDto,
  ) {
    const { probability } = pushAttendanceDto;

    if (!userId || !probability)
      throw new BadRequestException('Invalid attendance data');

    await this.eventService.pushAttendance(eventId, userId, probability);

    await this.usersService.pushAttendance(userId, eventId, probability);

    return { message: 'Attendance confirmed' };
  }

  async removeAttendance(eventId: string, userId: string) {
    if (!userId) throw new BadRequestException('Invalid attendance data');

    await this.eventService.removeAttendance(eventId, userId);

    await this.usersService.removeAttendance(userId, eventId);

    return { message: 'Attendance removed' };
  }
}
