import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../models/orders.entity';
import { Cart } from '../models/cart.entity';
import { Product } from '../models/product.entity';
import { CreateOrderDto } from '../dto/order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async getAllOrders(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['cart', 'cart.customer', 'cart.product'],
    });
  }

  async getOrderById(orderId: number, customerId: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { order_ID: orderId },
      relations: ['cart', 'cart.customer'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.cart.customer_ID !== customerId) {
      throw new ForbiddenException('Access denied: You are not allowed to view this order');
    }

    return order;
  }

  async createOrder(customerId: number, orderData: CreateOrderDto): Promise<Order> {
    const cart = await this.cartRepository.findOne({
      where: { cart_ID: orderData.cart_ID },
      relations: ['product', 'customer'],
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    if (cart.customer_ID !== customerId) {
      throw new ForbiddenException('Access denied: You are not allowed to create an order for this cart');
    }

    if (cart.status !== 'active') {
      throw new BadRequestException('Cart has already been checked out');
    }

    // Update product quantity
    const product = cart.product;
    const newQuantity = product.stock_quantity - cart.quantity;
    
    if (newQuantity < 0) {
      throw new BadRequestException('Not enough stock available');
    }

    product.stock_quantity = newQuantity;
    await this.productRepository.save(product);

    // Create order and update cart status
    cart.status = 'checked_out';
    await this.cartRepository.save(cart);

    const order = this.orderRepository.create({
      cart_ID: orderData.cart_ID,
    });

    return this.orderRepository.save(order);
  }

  async deleteOrder(orderId: number, customerId: number): Promise<void> {
    const order = await this.orderRepository.findOne({
      where: { order_ID: orderId },
      relations: ['cart'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.cart.customer_ID !== customerId) {
      throw new ForbiddenException('Access denied: You are not allowed to delete this order');
    }

    await this.orderRepository.remove(order);
  }
}