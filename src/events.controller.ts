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
  async findOne(@Param('id') id: string): Promise<Event> {
    return await this.repository.findOneBy({ id: parseInt(id) });
  }

  @Post()
  async create(@Body() body: ICreateEventDto): Promise<Event> {
    return await this.repository.save({
      ...body,
      when: new Date(body.when),
    });
  }

  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body() body: IUpdateEventDto,
  ): Promise<Event> {
    const event = await this.repository.findOneBy({ id: parseInt(id) });
    return await this.repository.save({
      ...event,
      ...body,
      when: body.when ? new Date(body.when) : event.when,
    });
  }

  @Delete('/:id')
  @HttpCode(204)
  async remove(@Param('id') id: string): Promise<void> {
    const event = await this.repository.findOneBy({ id: parseInt(id) });
    await this.repository.remove(event);
  }
}
