import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class CustomerType {
  @Field(() => ID)
  customer_ID: number;

  @Field()
  customer_FullName: string;

  @Field()
  customer_Email: string;

  @Field()
  customer_PhoneNumber: string;

  @Field(() => Int)
  role: number;
}