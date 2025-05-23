import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNumber, IsString, IsInt, Min } from 'class-validator';

@InputType()
export class CreateCustomizationInput {
  @Field(() => Int)
  @IsInt()
  @Min(0)
  customization_Size: number;

  @Field()
  @IsString()
  customization_Color: string;

  @Field(() => Int)
  @IsNumber()
  product_ID: number;
}

@InputType()
export class UpdateCustomizationInput {
  @Field(() => Int)
  @IsInt()
  @Min(0)
  customization_Size: number;

  @Field()
  @IsString()
  customization_Color: string;

  @Field(() => Int)
  @IsNumber()
  product_ID: number;
}