import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ICreateEventDto, IUpdateEventDto } from './event.dto';
import { Event } from './event.entity';

@Controller('/events')
export class EventsController {
  private events: Event[] = [];

  @Get()
  findAll(): Event[] {
    return this.events;
  }

  @Get('/:id')
  findOne(@Param('id') id: string): Event {
    return this.events.find((event) => event.id === parseInt(id));
  }

  @Post()
  create(@Body() body: ICreateEventDto): Event {
    const event = {
      ...body,
      when: new Date(body.when),
      id: this.events.length + 1,
    };
    this.events.push(event);
    return event;
  }

  @Patch('/:id')
  update(@Param('id') id: string, @Body() body: IUpdateEventDto): Event {
    const index = this.events.findIndex((event) => event.id === parseInt(id));
    this.events[index] = {
      ...this.events[index],
      ...body,
      when: body.when ? new Date(body.when) : this.events[index].when,
    };

    return this.events[index];
  }

  @Delete('/:id')
  @HttpCode(204)
  remove(@Param('id') id: string): void {
    this.events = this.events.filter((event) => event.id !== parseInt(id));
  }
}
