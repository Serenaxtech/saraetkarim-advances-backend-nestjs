import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ProductType } from '../types/product.type';
import { CreateProductInput, UpdateProductInput } from '../types/product-input.type';
import { ProductService } from '../../services/product.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';

@Resolver(() => ProductType)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Query(() => [ProductType])
  async products(): Promise<ProductType[]> {
    return this.productService.getAllProducts();
  }

  @Query(() => [ProductType])
  async productsInStock(): Promise<ProductType[]> {
    return this.productService.getAllProductsInStock();
  }

  @Query(() => ProductType)
  async product(@Args('id', { type: () => Int }) id: number): Promise<ProductType> {
    return this.productService.getProductById(id);
  }

  @Query(() => [ProductType])
  async productsByCategory(
    @Args('categoryId', { type: () => Int }) categoryId: number
  ): Promise<ProductType[]> {
    return this.productService.getProductByCategoryId(categoryId);
  }

  @Mutation(() => ProductType)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(0)
  async createProduct(
    @Args('input') createProductInput: CreateProductInput
  ): Promise<ProductType> {
    return this.productService.createProduct(createProductInput);
  }

  @Mutation(() => ProductType)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(0)
  async updateProduct(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') updateProductInput: UpdateProductInput
  ): Promise<ProductType> {
    return this.productService.updateProduct(id, updateProductInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(0)
  async deleteProduct(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    await this.productService.deleteProduct(id);
    return true;
  }
}