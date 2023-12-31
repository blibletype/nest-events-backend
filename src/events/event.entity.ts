import { Expose } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../auth/users/user.entity';
import { Paginated } from '../pagination/paginator';
import { Attendee } from './attendee.entity';

@Entity('events')
export class Event {
  constructor(partial?: Partial<Event>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column()
  @Expose()
  name: string;

  @Column()
  @Expose()
  description: string;

  @Column()
  @Expose()
  when: Date;

  @Column()
  @Expose()
  address: string;

  @OneToMany(() => Attendee, (attendee) => attendee.event, { cascade: true })
  @Expose()
  attendees: Attendee[];

  @ManyToOne(
    () => User,
    (user) => {
      user.organized;
    },
  )
  @Expose()
  @JoinColumn({ name: 'organizerId' })
  organizer: User;

  @Column({ nullable: true })
  organizerId: number;

  @Expose()
  attendeesCount?: number;
  @Expose()
  attendeesRejected?: number;
  @Expose()
  attendeesMaybe?: number;
  @Expose()
  attendeesAccepted?: number;
}

export class PaginatedEvents extends Paginated<Event>(Event) {}
