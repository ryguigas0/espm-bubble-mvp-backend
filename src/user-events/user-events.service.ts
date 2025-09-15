import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { EventsService } from 'src/events/events.service';
import { PushAttendanceDto } from './dto/push-attendance.dto';
import { CoordsDto } from './dto/coords.dto';
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

  async checkIn(eventId: string, userId: string, coordsDto: CoordsDto) {
    const { lat, lon } = coordsDto;

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

    const isUserWithinBounds = this.userWithinEventBounds(
      lat,
      lon,
      event.coords.coordinates[1],
      event.coords.coordinates[0],
    );

    if (!isUserWithinBounds) {
      throw new BadRequestException(
        'User ' + user.id + ' outside range of event ' + event.id,
      );
    }

    await this.usersService.checkIn(userId, eventId);

    return {
      message: 'User ' + user.id + ' checked in to ' + event.id,
      distance: userEventDistance,
    };
  }

  async checkOut(eventId: string, userId: string, coordsDto: CoordsDto) {
    const { lat, lon } = coordsDto;

    if (!lat || !lon) throw new BadRequestException('Invalid coordinates');

    const event = await this.eventService.findOne(eventId);

    const user = await this.usersService.findOne(userId);

    const attendance = user.attendance.find(
      (a) => a.eventId.toString() === eventId,
    );

    if (!attendance)
      throw new BadRequestException('User with no attendance to event');

    if (!attendance.checkedIn)
      throw new BadRequestException(
        'User cannot check out not checked in events',
      );

    const isUserOutsideBounds = !this.userWithinEventBounds(
      lat,
      lon,
      event.coords.coordinates[1],
      event.coords.coordinates[0],
    );

    if (isUserOutsideBounds) {
      throw new BadRequestException(
        'User ' + user.id + ' still inside range of event ' + event.id,
      );
    }

    await this.usersService.checkOut(userId, eventId);

    return {
      message: 'User ' + user.id + ' checked out to ' + event.id,
    };
  }

  userWithinEventBounds(
    userLat: number,
    userLon: number,
    eventLat: number,
    eventLon: number,
  ) {
    const userPos = turf.point([userLon, userLat]);
    const eventPos = turf.point([eventLon, eventLat]);

    const distanceFromEvent = turf.distance(eventPos, userPos, {
      units: 'meters',
    });

    return distanceFromEvent > 50;
  }
}
