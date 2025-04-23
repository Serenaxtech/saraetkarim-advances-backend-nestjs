import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  category_Name: string;
}

export class UpdateCategoryDto extends CreateCategoryDto {}