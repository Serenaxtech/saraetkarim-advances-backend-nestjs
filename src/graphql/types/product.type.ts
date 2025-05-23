import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class ProductType {
  @Field(() => ID)
  product_ID: number;

  @Field()
  product_Name: string;

  @Field()
  product_IMG: string;

  @Field()
  product_Description: string;

  @Field()
  product_Info: string;

  @Field(() => Float)
  product_Price: number;

  @Field(() => Int)
  category_ID: number;

  @Field(() => Int)
  stock_quantity: number;
}