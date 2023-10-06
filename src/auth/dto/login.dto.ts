import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class LoginDto {
  @Field()
  @IsNotEmpty()
  @MinLength(5)
  username: string;

  @Field()
  @IsNotEmpty()
  @MinLength(5)
  password: string;
}
