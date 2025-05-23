import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNumber, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateOrderInput {
  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  cart_ID: number;
}