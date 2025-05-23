import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNumber, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateShipmentInput {
  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  order_ID: number;

  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  customer_ID: number;
}