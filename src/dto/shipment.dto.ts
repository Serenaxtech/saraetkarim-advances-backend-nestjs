import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateShipmentDto {
  @IsNumber()
  @IsNotEmpty()
  order_ID: number;

  @IsNumber()
  @IsNotEmpty()
  customer_ID: number;
}

export class UpdateShipmentDto extends CreateShipmentDto {}