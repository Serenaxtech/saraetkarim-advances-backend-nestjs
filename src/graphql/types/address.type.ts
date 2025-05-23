import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { CustomerType } from './customer.type';

@ObjectType()
export class AddressType {
  @Field(() => ID)
  address_ID: number;

  @Field()
  region: string;

  @Field()
  street: string;

  @Field()
  building: string;

  @Field(() => Int)
  floor: number;

  @Field()
  moreDetails: string;

  @Field(() => Int)
  customer_ID: number;

  @Field(() => CustomerType)
  customer: CustomerType;
}