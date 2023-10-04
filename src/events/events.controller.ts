import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuardJwt } from 'src/auth/auth-guard.jwt';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateEventDto, UpdateEventDto } from './dto/event.dto';
import { Event } from './event.entity';
import { ListEvents } from './event.filters';
import { EventsService } from './events.service';

@Controller('/events')
@SerializeOptions({
  strategy: 'excludeAll',
})
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(private readonly eventsService: EventsService) {}

  // @Get('/practice/:id')
  // async practice(@Param('id', ParseIntPipe) id: number): Promise<Event> {
  //   // const event = await this.repository.findOne({
  //   //   where: { id },
  //   //   relations: ['attendees'],
  //   // });
  //   // this.logger.debug(`Event: ${JSON.stringify(event)}`);
  //   // return event;
  //   const event = await this.repository.findOne({
  //     where: { id },
  //     relations: ['attendees'],
  //   });
  //   const attendee = new Attendee();
  //   attendee.name = 'Name';
  //   // attendee.event = event;
  //   event.attendees.push(attendee);
  //   await this.repository.save(event);
  //   return event;
  // }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@Query() filter: ListEvents) {
    const events =
      await this.eventsService.getEventsWithAttendeesCountFilteredPaginated(
        filter,
        {
          currentPage: filter.page,
          total: true,
          limit: 2,
        },
      );
    return events;
  }

  @Get('/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Event> {
    const event = await this.eventsService.getEventWithAttendeeCount(id);

    if (!event) {
      throw new NotFoundException();
    }

    return event;
  }

  @Post()
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async create(
    @Body() body: CreateEventDto,
    @CurrentUser() user: User,
  ): Promise<Event> {
    return await this.eventsService.createEvent(body, user);
  }

  @Patch('/:id')
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateEventDto,
    @CurrentUser() user: User,
  ): Promise<Event> {
    const event = await this.eventsService.findOne(id);

    if (!event) {
      throw new NotFoundException();
    }

    if (event.organizerId !== user.id) {
      throw new ForbiddenException(
        null,
        'You are not allowed to change this event',
      );
    }

    return await this.eventsService.updateEvent(event, body);
  }

  @Delete('/:id')
  @HttpCode(204)
  @UseGuards(AuthGuardJwt)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ): Promise<void> {
    const event = await this.eventsService.findOne(id);

    if (!event) {
      throw new NotFoundException();
    }

    if (event.organizerId !== user.id) {
      throw new ForbiddenException(
        null,
        'You are not allowed to remove this event',
      );
    }

    await this.eventsService.removeEvent(id);
  }
}
