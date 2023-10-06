import { Repository } from 'typeorm';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { Event } from './event.entity';
import { ListEvents } from './event.filters';
import { User } from '../auth/users/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('EventsController', () => {
  let eventsService: EventsService;
  let eventsController: EventsController;
  let eventsRepository: Repository<Event>;

  beforeEach(() => {
    eventsService = new EventsService(eventsRepository);
    eventsController = new EventsController(eventsService);
  });

  it('should return a list of events', async () => {
    const result = {
      fisrt: 1,
      last: 1,
      limit: 10,
      data: [],
    };

    const spy = jest
      .spyOn(eventsService, 'getEventsWithAttendeesCountFilteredPaginated')
      .mockImplementation((): any => result);

    expect(await eventsController.findAll(new ListEvents())).toEqual(result);
    expect(spy).toBeCalledTimes(1);
  });

  it('should not delete an event, when it`s not found', async () => {
    const deleteSpy = jest.spyOn(eventsService, 'removeEvent');

    const findSpy = jest
      .spyOn(eventsService, 'findOne')
      .mockImplementation((): any => {
        undefined;
      });

    try {
      await eventsController.remove(1, new User());
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
    }

    expect(deleteSpy).toBeCalledTimes(0);
    expect(findSpy).toBeCalledTimes(1);
  });
});
