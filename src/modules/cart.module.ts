import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartController } from '../controllers/cart.controller';
import { CartService } from '../services/cart.service';
import { Cart } from '../models/cart.entity';
import { Product } from '../models/product.entity';
import { CartResolver } from '../graphql/resolvers/cart.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, Product])],
  controllers: [CartController],
  providers: [CartService, CartResolver],
  exports: [CartService],
})
export class CartModule {}