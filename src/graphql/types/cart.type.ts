import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { ProductType } from './product.type';

@ObjectType()
export class CartType {
  @Field(() => ID)
  cart_ID: number;

  @Field(() => Int)
  customer_ID: number;

  @Field(() => Int)
  product_ID: number;

  @Field(() => Int)
  quantity: number;

  @Field()
  status: string;

  @Field(() => ProductType, { nullable: true })
  product?: ProductType;
}