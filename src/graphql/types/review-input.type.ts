import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNumber, IsNotEmpty, IsString, Min, Max } from 'class-validator';

@InputType()
export class CreateReviewInput {
  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  product_ID: number;

  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(5)
  rating: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  review_Text: string;
}

@InputType()
export class UpdateReviewInput {
  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  product_ID: number;

  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(5)
  rating: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  review_Text: string;
}