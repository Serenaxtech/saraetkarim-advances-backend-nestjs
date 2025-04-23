import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';  // Added MoreThan import
import { Product } from '../models/product.entity';
import { CreateProductDto, UpdateProductDto, UpdateProductQuantityDto } from '../dto/product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async getAllProducts(): Promise<Product[]> {
    return this.productRepository.find({
      relations: ['category', 'reviews'],
    });
  }

  async getAllProductsInStock(): Promise<Product[]> {
    return this.productRepository.find({
      where: { 
        stock_quantity: MoreThan(0) 
      },
      relations: ['category', 'reviews'],
    });
  }

  async getProductById(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { product_ID: id },
      relations: ['category', 'reviews'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async getProductByCategoryId(categoryId: number): Promise<Product[]> {
    return this.productRepository.find({
      where: { category_ID: categoryId },
      relations: ['category', 'reviews'],
    });
  }

  async createProduct(productData: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(productData);
    return this.productRepository.save(product);
  }

  async updateProduct(id: number, productData: UpdateProductDto): Promise<Product> {
    const product = await this.getProductById(id);
    Object.assign(product, productData);
    return this.productRepository.save(product);
  }

  async updateProductQuantity(id: number, quantityData: UpdateProductQuantityDto): Promise<Product> {
    const product = await this.getProductById(id);
    product.stock_quantity = quantityData.quantity;
    return this.productRepository.save(product);
  }

  async deleteProduct(id: number): Promise<void> {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Product not found');
    }
  }
}