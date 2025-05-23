import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from '../controllers/order.controller';
import { OrderService } from '../services/order.service';
import { Order } from '../models/orders.entity';
import { Cart } from '../models/cart.entity';
import { Product } from '../models/product.entity';
import { OrderResolver } from '../graphql/resolvers/order.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Cart, Product])],
  controllers: [OrderController],
  providers: [OrderService, OrderResolver],
  exports: [OrderService],
})
export class OrderModule {}