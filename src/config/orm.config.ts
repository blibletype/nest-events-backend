import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Attendee } from '../events/attendee.entity';
import { Event } from '../events/event.entity';
import { Subject } from '../school/subject.entity';
import { Teacher } from '../school/teacher.entity';
import { User } from '../auth/users/user.entity';
import { Profile } from '../auth/users/profile.entity';
import { Course } from 'src/school/course.entity';

export default registerAs(
  'orm.config',
  (): TypeOrmModuleOptions => ({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [Event, Attendee, Subject, Teacher, User, Profile, Course],
    synchronize: true,
    dropSchema: Boolean(parseInt(process.env.DB_DROP_SCHEMA)),
  }),
);
