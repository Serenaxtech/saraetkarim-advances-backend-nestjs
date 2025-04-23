import { IsString, IsNumber, IsNotEmpty, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  product_IMG: string;

  @IsString()
  @IsNotEmpty()
  product_Name: string;

  @IsString()
  @IsNotEmpty()
  product_Description: string;

  @IsString()
  @IsNotEmpty()
  product_Info: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  product_Price: number;

  @IsNumber()
  @IsNotEmpty()
  category_ID: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  stock_quantity: number;
}

export class UpdateProductDto extends CreateProductDto {}

export class UpdateProductQuantityDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  quantity: number;
}