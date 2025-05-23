import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNumber, IsNotEmpty, Min } from 'class-validator';

@InputType()
export class CreateCartInput {
  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  product_ID: number;

  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  quantity: number;
}

@InputType()
export class UpdateCartInput {
  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  quantity: number;
}