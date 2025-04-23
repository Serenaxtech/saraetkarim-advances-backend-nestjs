import { IsNumber, IsNotEmpty, Min } from 'class-validator';

export class CreateCartDto {
  @IsNumber()
  @IsNotEmpty()
  product_ID: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  quantity: number;
}

export class UpdateCartDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  quantity: number;
}