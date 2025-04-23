import { IsNumber, IsString, IsInt, Min } from 'class-validator';

export class CreateCustomizationDto {
  @IsInt()
  @Min(0)
  size: number;

  @IsString()
  color: string;

  @IsNumber()
  product_ID: number;
}

export class UpdateCustomizationDto {
  @IsInt()
  @Min(0)
  size: number;

  @IsString()
  color: string;

  @IsNumber()
  product_ID: number;
}