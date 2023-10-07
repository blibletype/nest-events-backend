import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Subject } from './subject.entity';
import { Teacher } from '../teachers/teacher.entity';
import { Logger } from '@nestjs/common';
import { Course } from '../courses/course.entity';

@Resolver(() => Subject)
export class SubjectsResolver {
  private readonly logger = new Logger(SubjectsResolver.name);

  @ResolveField('teachers', () => [Teacher])
  public async teachers(@Parent() subject: Subject): Promise<Teacher[]> {
    this.logger.debug(`@ResolveField teachers was called`);
    return await subject.teachers;
  }

  @ResolveField('courses', () => [Course])
  public async courses(@Parent() subject: Subject): Promise<Course[]> {
    this.logger.debug(`@ResolveField courses was called`);
    return await subject.courses;
  }
}
