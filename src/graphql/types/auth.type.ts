import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class AuthType {
  @Field()
  token: string;

  @Field()
  success: boolean;

  @Field({ nullable: true })
  message?: string;
}