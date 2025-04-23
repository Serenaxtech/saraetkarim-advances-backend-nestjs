import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '../models/cart.entity';
import { Product } from '../models/product.entity';
import { CreateCartDto, UpdateCartDto } from '../dto/cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async getAllCarts(): Promise<Cart[]> {
    return this.cartRepository.find({
      relations: ['customer', 'product'],
    });
  }

  async getCartById(id: number): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { cart_ID: id },
      relations: ['customer', 'product'],
    });

    if (!cart) {
      throw new NotFoundException('Cart item not found');
    }
    return cart;
  }

  async getActiveCartsByCustomerId(customerId: number): Promise<Cart[]> {
    return this.cartRepository.find({
      where: { 
        customer_ID: customerId,
        status: 'active'
      },
      relations: ['product'],
    });
  }

  async addToCart(customerId: number, cartData: CreateCartDto): Promise<Cart> {
    const product = await this.productRepository.findOne({
      where: { product_ID: cartData.product_ID } 
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (cartData.quantity > product.stock_quantity) { 
      throw new BadRequestException('Please select less quantity');
    }

    const cart = this.cartRepository.create({
      customer_ID: customerId,
      product_ID: cartData.product_ID,
      quantity: cartData.quantity,
      status: 'active'
    });

    return this.cartRepository.save(cart);
  }

  async updateCartItem(id: number, customerId: number, cartData: UpdateCartDto): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { 
        cart_ID: id,
        customer_ID: customerId
      }
    });

    if (!cart) {
      throw new NotFoundException('Cart item not found');
    }

    cart.quantity = cartData.quantity;
    return this.cartRepository.save(cart);
  }

  async deleteCartItem(id: number, customerId: number): Promise<void> {
    const result = await this.cartRepository.delete({
      cart_ID: id,
      customer_ID: customerId
    });

    if (result.affected === 0) {
      throw new NotFoundException('Cart item not found');
    }
  }

  async calculateTotal(customerId: number): Promise<number> {
    try {
      console.log('Starting calculateTotal for customer:', customerId);

      if (!customerId || isNaN(customerId)) {
        console.log('Invalid customerID detected:', customerId);
        throw new BadRequestException('Invalid customer ID');
      }

      const carts = await this.cartRepository.find({
        where: { 
          customer_ID: customerId,
          status: 'active'
        },
        relations: ['product']
      });

      console.log('Retrieved carts:', JSON.stringify(carts, null, 2));

      if (!carts || carts.length === 0) {
        console.log('No carts found for customer');
        return 0;
      }

      const total = carts.reduce((sum, cart) => {
        console.log('Processing cart item:', {
          cartId: cart.cart_ID,
          product: cart.product,
          quantity: cart.quantity
        });

        if (!cart.product) {
          console.log('No product found for cart item');
          return sum;
        }
        
        const price = Number(cart.product.product_Price) || 0;
        const quantity = Number(cart.quantity) || 0;
        const itemTotal = price * quantity;
        
        console.log('Item calculation:', { price, quantity, itemTotal });
        
        return sum + itemTotal;
      }, 0);

      console.log('Final total:', total);
      return Number(total.toFixed(2));
    } catch (error) {
      console.error('Error in calculateTotal:', error);
      throw new BadRequestException('Error calculating cart total');
    }
  }
}