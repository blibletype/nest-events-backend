import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Subject } from '../subjects/subject.entity';
import { Gender } from '../school.types';
import { Course } from '../courses/course.entity';
import { Paginated } from 'src/pagination/paginator';

@Entity()
@ObjectType()
export class Teacher {
  constructor(partial?: Partial<Teacher>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  @Field({ nullable: true })
  id: number;

  @Column()
  @Field()
  name: string;

  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.Other,
  })
  @Field(() => Gender)
  gender: Gender;

  @ManyToMany(() => Subject, (subject) => subject.teachers)
  @Field(() => [Subject])
  subjects: Promise<Subject[]>;

  @OneToMany(() => Course, (course) => course.teacher)
  @Field(() => [Course], { nullable: true })
  courses: Promise<Course[]>;
}

@ObjectType()
export class PaginatedTeachers extends Paginated<Teacher>(Teacher) {}
