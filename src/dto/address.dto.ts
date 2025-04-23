import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  @IsNotEmpty()
  region: string;

  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  @IsNotEmpty()
  building: string;

  @IsNumber()
  @IsNotEmpty()
  floor: number;

  @IsString()
  @IsOptional()
  moreDetails?: string;
}

export class UpdateAddressDto extends CreateAddressDto {}