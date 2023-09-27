import { IsDateString, IsString, Length } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

class EventDto {
  @IsString()
  @Length(5, 255)
  name: string;

  @Length(5, 255)
  description: string;

  @IsDateString()
  when: string;

  @Length(5, 255)
  address: string;
}

export class CreateEventDto extends EventDto {}
export class UpdateEventDto extends PartialType(EventDto) {}
