import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Course } from './course.entity';
import { Logger } from '@nestjs/common';
import { Teacher } from '../teachers/teacher.entity';
import { Subject } from '../subjects/subject.entity';

@Resolver(() => Course)
export class CoursesResolver {
  private readonly logger = new Logger(CoursesResolver.name);

  @ResolveField('teacher')
  public async teacher(@Parent() course: Course): Promise<Teacher> {
    this.logger.debug(`@ResolveField teacher was called`);
    return await course.teacher;
  }

  @ResolveField('subject')
  public async subject(@Parent() course: Course): Promise<Subject> {
    this.logger.debug(`@ResolveField subject was called`);
    return await course.subject;
  }
}
