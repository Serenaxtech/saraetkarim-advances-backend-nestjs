import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from '../controllers/product.controller';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.entity';
import { ProductResolver } from '../graphql/resolvers/product.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductController],
  providers: [ProductService, ProductResolver],
  exports: [ProductService],
})
export class ProductModule {}