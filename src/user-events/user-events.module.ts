import { Module } from '@nestjs/common';
import { UserEventsService } from './user-events.service';
import { UserEventsController } from './user-events.controller';
import { UsersModule } from 'src/users/users.module';
import { EventsModule } from 'src/events/events.module';

@Module({
  controllers: [UserEventsController],
  providers: [UserEventsService],
  imports: [UsersModule, EventsModule],
})
export class UserEventsModule {}
