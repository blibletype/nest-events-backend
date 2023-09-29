import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Event } from './event.entity';
import { Injectable, Logger } from '@nestjs/common';
import { AttendeeAnswerEnum } from './attendee.entity';
import { ListEvents, WhenEventFilterEnum } from './event.filters';
import { PaginateOptions, paginate } from 'src/pagination/paginator';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
  ) {}

  private getEventsBaseQuery() {
    return this.eventsRepository
      .createQueryBuilder('e')
      .orderBy('e.id', 'DESC');
  }

  public async getEvent(id: number): Promise<Event | undefined> {
    const query = this.getEventsWithAttendeesCountQuery().where('e.id = :id', {
      id,
    });

    this.logger.debug(query.getSql());

    return await query.getOne();
  }

  private async getEventsWithAttendeesCountFiltered(filter?: ListEvents) {
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

  public getEventsWithAttendeesCountQuery() {
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
  ) {
    return await paginate<Event>(
      await this.getEventsWithAttendeesCountFiltered(filter),
      paginateOptions,
    );
  }

  public async removeEvent(id: number): Promise<DeleteResult> {
    return await this.eventsRepository
      .createQueryBuilder('e')
      .delete()
      .where('id = :id', { id })
      .execute();
  }
}
