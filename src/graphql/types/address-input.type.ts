import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateAddressInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  region: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  street: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  building: string;

  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  floor: number;

  @Field({ nullable: true })
  moreDetails?: string;
}

@InputType()
export class UpdateAddressInput {
  @Field()
  @IsString()
  region: string;

  @Field()
  @IsString()
  street: string;

  @Field()
  @IsString()
  building: string;

  @Field(() => Int)
  @IsNumber()
  floor: number;

  @Field({ nullable: true })
  moreDetails?: string;
}