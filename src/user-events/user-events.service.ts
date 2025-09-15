import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { EventsService } from 'src/events/events.service';
import { PushAttendanceDto } from './dto/push-attendance.dto';
import { CheckInDto } from './dto/check-in.dto';
import * as turf from '@turf/turf';

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

  async checkIn(eventId: string, userId: string, checkInDto: CheckInDto) {
    const { lat, lon } = checkInDto;

    if (!lat || !lon) throw new BadRequestException('Invalid coordinates');

    const event = await this.eventService.findOne(eventId);

    const user = await this.usersService.findOne(userId);

    if (!user.attendance.find((a) => a.eventId.toString() === eventId)) {
      throw new BadRequestException('User with no attendance to event');
    }

    const userPos = turf.point([lon, lat]);
    const eventPos = turf.point(event.coords.coordinates);

    const userEventDistance = turf.distance(eventPos, userPos, {
      units: 'meters',
    });

    if (userEventDistance > 50) {
      throw new BadRequestException(
        'User ' + user.id + ' out of range of event ' + event.id,
      );
    }

    await this.usersService.checkIn(userId, eventId);

    return {
      message: 'User ' + user.id + ' checked in to ' + event.id,
      distance: userEventDistance,
    };
  }
}
