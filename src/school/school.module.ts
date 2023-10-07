import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subject } from './subjects/subject.entity';
import { Teacher } from './teachers/teacher.entity';
import { SchoolController } from './school.controller';
import { TeachersResolver } from './teachers/teachers.resolver';
import { Course } from './courses/course.entity';
import { SubjectsResolver } from './subjects/subjects.resolver';
import { CoursesResolver } from './courses/courses.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Subject, Teacher, Course])],
  providers: [TeachersResolver, SubjectsResolver, CoursesResolver],
  controllers: [SchoolController],
})
export class SchoolModule {}
