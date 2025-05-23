import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { OrderType } from './order.type';
import { CustomerType } from './customer.type';

@ObjectType()
export class ShipmentType {
  @Field(() => ID)
  shipment_ID: number;

  @Field(() => Int)
  order_ID: number;

  @Field(() => Int)
  customer_ID: number;

  @Field(() => OrderType)
  order: OrderType;

  @Field(() => CustomerType)
  customer: CustomerType;
}