import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { CustomerType } from './customer.type';
import { ProductType } from './product.type';

@ObjectType()
export class ReviewType {
  @Field(() => ID)
  review_ID: number;

  @Field(() => Int)
  customer_ID: number;

  @Field(() => Int)
  product_ID: number;

  @Field(() => Int)
  rating: number;

  @Field()
  review_Text: string;

  @Field(() => CustomerType)
  customer: CustomerType;

  @Field(() => ProductType)
  product: ProductType;
}