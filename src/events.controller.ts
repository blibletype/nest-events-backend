import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { CreateEventDto, UpdateEventDto } from './event.dto';
import { Event } from './event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Controller('/events')
export class EventsController {
  constructor(
    @InjectRepository(Event)
    private readonly repository: Repository<Event>,
  ) {}

  @Get()
  async findAll(): Promise<Event[]> {
    return await this.repository.find();
  }

  @Get('/:id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Event> {
    return await this.repository.findOneBy({ id });
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
