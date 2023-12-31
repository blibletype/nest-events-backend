import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { EventsController } from './events.controller';
import { Attendee } from './attendee.entity';
import { EventsService } from './events.service';
import { AttendeesService } from './attendees.service';
import { EventAttendeesController } from './event-attendees.controller';
import { CurrentUserEventAttendanceController } from './current-user-event-attendance.controller';
import { EventsOrganizedByUserConstroller } from './events-organized-by-user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Attendee])],
  controllers: [
    EventsController,
    EventAttendeesController,
    CurrentUserEventAttendanceController,
    EventsOrganizedByUserConstroller,
  ],
  providers: [EventsService, AttendeesService],
})
export class EventsModule {}
