import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { ProductType } from './product.type';

@ObjectType()
export class CustomizationType {
  @Field(() => ID)
  customization_ID: number;

  @Field(() => Int)
  customization_Size: number;

  @Field()
  customization_Color: string;

  @Field(() => Int)
  product_ID: number;

  @Field(() => ProductType)
  product: ProductType;
}