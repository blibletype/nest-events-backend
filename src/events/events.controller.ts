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
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventDto, UpdateEventDto } from './event.dto';
import { Event } from './event.entity';

@Controller('/events')
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(
    @InjectRepository(Event)
    private readonly repository: Repository<Event>,
  ) {}

  @Get()
  async findAll(): Promise<Event[]> {
    this.logger.log('Hit the findAll route');
    const events = await this.repository.find();
    this.logger.debug(`Found ${events.length} events`);
    return events;
  }

  @Get('/:id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Event> {
    const event = await this.repository.findOneBy({ id });

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
    const event = await this.repository.findOneBy({ id });
    await this.repository.remove(event);
  }
}
