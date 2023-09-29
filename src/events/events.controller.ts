import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventDto, UpdateEventDto } from './event.dto';
import { Event } from './event.entity';
import { Attendee } from './attendee.entity';
import { EventsService } from './events.service';
import { ListEvents } from './event.filters';

@Controller('/events')
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(
    @InjectRepository(Event)
    private readonly repository: Repository<Event>,
    @InjectRepository(Attendee)
    private readonly attendeeRepository: Repository<Attendee>,
    private readonly eventsService: EventsService,
  ) {}

  @Get('/practice/:id')
  async practice(@Param('id', ParseIntPipe) id: number): Promise<Event> {
    // const event = await this.repository.findOne({
    //   where: { id },
    //   relations: ['attendees'],
    // });
    // this.logger.debug(`Event: ${JSON.stringify(event)}`);
    // return event;
    const event = await this.repository.findOne({
      where: { id },
      relations: ['attendees'],
    });
    const attendee = new Attendee();
    attendee.name = 'Name';
    // attendee.event = event;
    event.attendees.push(attendee);
    await this.repository.save(event);
    return event;
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
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
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Event> {
    const event = await this.eventsService.getEvent(id);

    if (!event) {
      throw new NotFoundException();
    }

    return event;
  }

  @Post()
  async create(@Body() body: CreateEventDto): Promise<Event> {
    return await this.repository.save({
      ...body,
      when: new Date(body.when),
    });
  }

  @Patch('/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateEventDto,
  ): Promise<Event> {
    const event = await this.repository.findOneBy({ id });
    return await this.repository.save({
      ...event,
      ...body,
      when: body.when ? new Date(body.when) : event.when,
    });
  }

  @Delete('/:id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const result = await this.eventsService.removeEvent(id);
    if (result?.affected !== 1) {
      throw new NotFoundException();
    }
  }
}
