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
    if (isNaN(customerId) || customerId <= 0) {
      throw new BadRequestException('Invalid customer ID');
    }

    try {
      const activeCarts = await this.cartRepository.find({
        where: { 
          customer_ID: customerId,
          status: 'active'
        },
        relations: ['product']
      });

      if (!activeCarts || activeCarts.length === 0) {
        return 0;
      }

      const total = activeCarts.reduce((sum, cart) => {
        if (!cart.product) return sum;
        const itemPrice = Number(cart.product.product_Price) || 0;
        const quantity = Number(cart.quantity) || 0;
        return sum + (itemPrice * quantity);
      }, 0);

      return Number(total.toFixed(2));
    } catch (error) {
      throw new BadRequestException(`Error calculating cart total: ${error.message}`);
    }
  }
}