import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TokenDto {
  constructor(partial?: Partial<TokenDto>) {
    Object.assign(this, partial);
  }

  @Field()
  token: string;
}
