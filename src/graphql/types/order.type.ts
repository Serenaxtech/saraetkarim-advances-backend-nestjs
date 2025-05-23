import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { CartType } from './cart.type';

@ObjectType()
export class OrderType {
  @Field(() => ID)
  order_ID: number;

  @Field(() => Int)
  cart_ID: number;

  @Field(() => CartType)
  cart: CartType;
}