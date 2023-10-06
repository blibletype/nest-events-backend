import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subject } from './subject.entity';
import { Teacher } from './teacher.entity';
import { TrainingController } from './training.controller';
import { TeacherResolver } from './teacher.resolver';
import { Course } from './course.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subject, Teacher, Course])],
  providers: [TeacherResolver],
  controllers: [TrainingController],
})
export class SchoolModule {}
