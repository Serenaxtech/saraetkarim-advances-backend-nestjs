import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  @IsNotEmpty()
  cart_ID: number;
}

export class UpdateOrderDto extends CreateOrderDto {}