import { InputType, Field, Float, Int } from '@nestjs/graphql';
import { IsString, IsNumber, IsNotEmpty, Min } from 'class-validator';

@InputType()
export class CreateProductInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  product_Name: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  product_IMG: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  product_Description: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  product_Info: string;

  @Field(() => Float)
  @IsNumber()
  @IsNotEmpty()
  product_Price: number;

  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  category_ID: number;

  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  stock_quantity: number;
}

@InputType()
export class UpdateProductInput extends CreateProductInput {}