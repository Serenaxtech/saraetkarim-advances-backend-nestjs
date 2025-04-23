import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { CreateProductDto, UpdateProductDto, UpdateProductQuantityDto } from '../dto/product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @Roles(0, 1)
  async getAllProducts() {
    return this.productService.getAllProductsInStock();
  }

  @Get('all')
  @Roles(0)
  async getAllProductsAdmin() {
    return this.productService.getAllProducts();
  }

  @Get(':id')
  @Roles(0, 1)
  async getProductById(@Param('id') id: number) {
    return this.productService.getProductById(id);
  }

  @Get('category/:categoryId')
  @Roles(0, 1)
  async getProductByCategoryId(@Param('categoryId') categoryId: number) {
    return this.productService.getProductByCategoryId(categoryId);
  }

  @Post()
  @Roles(0)
  async createProduct(@Body() productData: CreateProductDto) {
    return this.productService.createProduct(productData);
  }

  @Put(':id')
  @Roles(0)
  async updateProduct(
    @Param('id') id: number,
    @Body() productData: UpdateProductDto,
  ) {
    return this.productService.updateProduct(id, productData);
  }

  @Put(':id/quantity')
  @Roles(0)
  async updateProductQuantity(
    @Param('id') id: number,
    @Body() quantityData: UpdateProductQuantityDto,
  ) {
    return this.productService.updateProductQuantity(id, quantityData);
  }

  @Delete(':id')
  @Roles(0)
  async deleteProduct(@Param('id') id: number) {
    await this.productService.deleteProduct(id);
    return { message: 'Product deleted successfully' };
  }
}