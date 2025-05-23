import { Resolver, Query, Mutation, Args, Int, Context, Float } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CartType } from '../types/cart.type';
import { CreateCartInput, UpdateCartInput } from '../types/cart-input.type';
import { CartService } from '../../services/cart.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';

@Resolver(() => CartType)
export class CartResolver {
  constructor(private readonly cartService: CartService) {}

  @Query(() => [CartType])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(0)
  async carts(): Promise<CartType[]> {
    return this.cartService.getAllCarts();
  }

  @Query(() => CartType)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(0, 1)
  async cart(@Args('id', { type: () => Int }) id: number): Promise<CartType> {
    return this.cartService.getCartById(id);
  }

  @Query(() => [CartType])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(0, 1)
  async customerCart(@Context() context: any): Promise<CartType[]> {
    return this.cartService.getActiveCartsByCustomerId(context.req.user.id);
  }

  @Query(() => Float)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(0, 1)
  async cartTotal(@Context() context: any): Promise<number> {
    return this.cartService.calculateTotal(context.req.user.id);
  }

  @Mutation(() => CartType)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(0, 1)
  async addToCart(
    @Args('input') createCartInput: CreateCartInput,
    @Context() context: any
  ): Promise<CartType> {
    return this.cartService.addToCart(context.req.user.id, createCartInput);
  }

  @Mutation(() => CartType)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(0, 1)
  async updateCartItem(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') updateCartInput: UpdateCartInput,
    @Context() context: any
  ): Promise<CartType> {
    return this.cartService.updateCartItem(id, context.req.user.id, updateCartInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(0, 1)
  async removeFromCart(
    @Args('id', { type: () => Int }) id: number,
    @Context() context: any
  ): Promise<boolean> {
    await this.cartService.deleteCartItem(id, context.req.user.id);
    return true;
  }
}