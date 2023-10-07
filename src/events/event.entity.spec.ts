import { Event } from './event.entity';

test('Event should be initialized through constructor', () => {
  const event = new Event({
    name: 'Event name',
    description: 'Event description',
  });

  expect(event).toEqual({
    name: 'Event name',
    description: 'Event description',
    id: undefined,
    when: undefined,
    address: undefined,
    attendees: undefined,
    organizer: undefined,
    organizerId: undefined,
    event: undefined,
    attendeesCount: undefined,
    attendeesRejected: undefined,
    attendeesMaybe: undefined,
    attendeesAccepted: undefined,
  });
});
