import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { OrderType } from '../types/order.type';
import { CreateOrderInput } from '../types/order-input.type';
import { OrderService } from '../../services/order.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';

@Resolver(() => OrderType)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Query(() => [OrderType])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(0)
  async orders(): Promise<OrderType[]> {
    return this.orderService.getAllOrders();
  }

  @Query(() => OrderType)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(0, 1)
  async order(
    @Args('id', { type: () => Int }) id: number,
    @Context() context: any
  ): Promise<OrderType> {
    return this.orderService.getOrderById(id, context.req.user.id);
  }

  @Mutation(() => OrderType)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(0, 1)
  async createOrder(
    @Args('input') createOrderInput: CreateOrderInput,
    @Context() context: any
  ): Promise<OrderType> {
    return this.orderService.createOrder(createOrderInput.cart_ID, context.req.user.id);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(0, 1)
  async deleteOrder(
    @Args('id', { type: () => Int }) id: number,
    @Context() context: any
  ): Promise<boolean> {
    await this.orderService.deleteOrder(id, context.req.user.id);
    return true;
  }
}