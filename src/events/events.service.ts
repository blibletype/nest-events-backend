import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/users/user.entity';
import { PaginateOptions, paginate } from 'src/pagination/paginator';
import { DeleteResult, Repository, SelectQueryBuilder } from 'typeorm';
import { AttendeeAnswerEnum } from './attendee.entity';
import { CreateEventDto, UpdateEventDto } from './dto/event.dto';
import { Event, PaginatedEvents } from './event.entity';
import { ListEvents, WhenEventFilterEnum } from './event.filters';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
  ) {}

  private getEventsBaseQuery(): SelectQueryBuilder<Event> {
    return this.eventsRepository
      .createQueryBuilder('e')
      .orderBy('e.id', 'DESC');
  }

  public async findOne(id: number): Promise<Event> {
    return await this.eventsRepository.findOne({ where: { id } });
  }

  public async getEventWithAttendeeCount(
    id: number,
  ): Promise<Event | undefined> {
    const query = this.getEventsWithAttendeesCountQuery().where('e.id = :id', {
      id,
    });

    this.logger.debug(query.getSql());

    return await query.getOne();
  }

  private getEventsWithAttendeesCountFilteredQuery(
    filter?: ListEvents,
  ): SelectQueryBuilder<Event> {
    let query = this.getEventsWithAttendeesCountQuery();

    if (!filter) {
      return query;
    }

    if (filter.when) {
      this.logger.debug('Filtering by when: ' + filter.when);
      if (filter.when == WhenEventFilterEnum.Today) {
        query = query.andWhere(
          'e.when >= CURDATE() AND e.when < CURDATE() + INTERVAL 1 DAY',
        );
      }

      if (filter.when == WhenEventFilterEnum.Tommorow) {
        query = query.andWhere(
          'e.when >= CURDATE() + INTERVAL 1 DAY AND e.when <= CURDATE() + INTERVAL 2 DAY',
        );
      }

      if (filter.when == WhenEventFilterEnum.ThisWeek) {
        query = query.andWhere('YEARWEEK(e.when, 1) = YEARWEEK(CURDATE(), 1)');
      }

      if (filter.when == WhenEventFilterEnum.NextWeek) {
        query = query.andWhere(
          'YEARWEEK(e.when, 1) = YEARWEEK(CURDATE(), 1) + 1',
        );
      }
    }

    this.logger.debug(query.getSql());
    return query;
  }

  public getEventsWithAttendeesCountQuery(): SelectQueryBuilder<Event> {
    return this.getEventsBaseQuery()
      .loadRelationCountAndMap('e.attendeesCount', 'e.attendees')
      .loadRelationCountAndMap(
        'e.attendeesAccepted',
        'e.attendees',
        'attendees',
        (qb) =>
          qb.where('attendees.attendeeAnswer = :answer', {
            answer: AttendeeAnswerEnum.Accepted,
          }),
      )
      .loadRelationCountAndMap(
        'e.attendeesMaybe',
        'e.attendees',
        'attendees',
        (qb) =>
          qb.where('attendees.attendeeAnswer = :answer', {
            answer: AttendeeAnswerEnum.Maybe,
          }),
      )
      .loadRelationCountAndMap(
        'e.attendeesRejected',
        'e.attendees',
        'attendees',
        (qb) =>
          qb.where('attendees.attendeeAnswer = :answer', {
            answer: AttendeeAnswerEnum.Rejected,
          }),
      );
  }

  public async getEventsWithAttendeesCountFilteredPaginated(
    filter: ListEvents,
    paginateOptions: PaginateOptions,
  ): Promise<PaginatedEvents> {
    return await paginate<Event>(
      await this.getEventsWithAttendeesCountFilteredQuery(filter),
      paginateOptions,
    );
  }

  public async createEvent(input: CreateEventDto, user: User): Promise<Event> {
    return await this.eventsRepository.save(
      new Event({
        ...input,
        organizer: user,
        when: new Date(input.when),
      }),
    );
  }

  public async updateEvent(
    event: Event,
    input: UpdateEventDto,
  ): Promise<Event> {
    return await this.eventsRepository.save(
      new Event({
        ...event,
        ...input,
        when: input.when ? new Date(input.when) : event.when,
      }),
    );
  }

  public async removeEvent(id: number): Promise<DeleteResult> {
    return await this.eventsRepository
      .createQueryBuilder('e')
      .delete()
      .where('id = :id', { id })
      .execute();
  }

  private getEventsOrganizedByUserIdQuery(
    userId: number,
  ): SelectQueryBuilder<Event> {
    return this.getEventsBaseQuery().where('e.organizerId = :userId', {
      userId,
    });
  }

  public async getEventsOrganizedByUserIdPaginated(
    userId: number,
    paginateOptions: PaginateOptions,
  ): Promise<PaginatedEvents> {
    return await paginate<Event>(
      this.getEventsOrganizedByUserIdQuery(userId),
      paginateOptions,
    );
  }

  private getEventsAttendedByUserIdQuery(
    userId: number,
  ): SelectQueryBuilder<Event> {
    return this.getEventsBaseQuery()
      .leftJoinAndSelect('e.attendess', 'a')
      .where('a.userId = :userId', { userId });
  }

  public async getEventsAttendedByUserIdPaginated(
    userId: number,
    paginateOptions: PaginateOptions,
  ): Promise<PaginatedEvents> {
    return await paginate<Event>(
      this.getEventsAttendedByUserIdQuery(userId),
      paginateOptions,
    );
  }
}
