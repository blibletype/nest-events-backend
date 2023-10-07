import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Teacher } from './teacher.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TeacherAddDto } from '../dto/teacher-add.dto';
import { Logger, UseGuards } from '@nestjs/common';
import { TeacherEditDto } from '../dto/teacher-edit.dto';
import { EntityWithId } from '../school.types';
import { AuthGuardJwtGql } from '../../auth/guards/auth-guard-jwt.gql';

@Resolver(() => Teacher)
export class TeachersResolver {
  private readonly logger = new Logger(TeachersResolver.name);

  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
  ) {}

  @Query(() => [Teacher])
  public async teachers(): Promise<Teacher[]> {
    return await this.teacherRepository.find();
  }

  @Query(() => Teacher)
  public async teacher(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Teacher> {
    return await this.teacherRepository.findOneOrFail({
      where: { id },
    });
  }

  @Mutation(() => Teacher, { name: 'teacherAdd' })
  @UseGuards(AuthGuardJwtGql)
  public async add(
    @Args('body', { type: () => TeacherAddDto })
    body: TeacherAddDto,
  ): Promise<Teacher> {
    return await this.teacherRepository.save(new Teacher(body));
  }

  @Mutation(() => Teacher, { name: 'teacherEdit' })
  public async edit(
    @Args('id', { type: () => Int })
    id: number,
    @Args('body', { type: () => TeacherEditDto })
    body: TeacherEditDto,
  ): Promise<Teacher> {
    const teacher = await this.teacherRepository.findOneOrFail({
      where: { id },
    });
    return await this.teacherRepository.save(
      new Teacher(Object.assign(teacher, body)),
    );
  }

  @Mutation(() => EntityWithId, { name: 'teacherDelete' })
  public async delete(
    @Args('id', { type: () => Int })
    id: number,
  ): Promise<EntityWithId> {
    const teacher = await this.teacherRepository.findOneOrFail({
      where: { id },
    });
    await this.teacherRepository.remove(teacher);
    return new EntityWithId(id);
  }

  @ResolveField('subjects')
  public async subjects(@Parent() teacher: Teacher) {
    this.logger.debug(`@ResolveField subject was called`);
    return await teacher.subjects;
  }
}
