import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CategoryService } from '../services/category.service';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @Roles(0, 1)
  async getAllCategories() {
    return this.categoryService.getAllCategories();
  }

  @Get(':id')
  @Roles(0, 1)
  async getCategoryById(@Param('id') id: number) {
    return this.categoryService.getCategoryById(id);
  }

  @Post()
  @Roles(0)
  async createCategory(@Body() categoryData: CreateCategoryDto) {
    return this.categoryService.createCategory(categoryData);
  }

  @Put(':id')
  @Roles(0)
  async updateCategory(
    @Param('id') id: number,
    @Body() categoryData: UpdateCategoryDto,
  ) {
    return this.categoryService.updateCategory(id, categoryData);
  }

  @Delete(':id')
  @Roles(0)
  async deleteCategory(@Param('id') id: number) {
    await this.categoryService.deleteCategory(id);
    return { message: 'Category deleted successfully' };
  }
}