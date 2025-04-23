import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { CreateOrderDto } from '../dto/order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @Roles(0)
  async getAllOrders() {
    return this.orderService.getAllOrders();
  }

  @Get(':id')
  @Roles(0, 1)
  async getOrderById(@Param('id') id: number, @Request() req) {
    return this.orderService.getOrderById(id, req.user.id);
  }

  @Post()
  @Roles(0, 1)
  async createOrder(@Body() orderData: CreateOrderDto, @Request() req) {
    return this.orderService.createOrder(req.user.id, orderData);
  }

  @Delete(':id')
  @Roles(0, 1)
  async deleteOrder(@Param('id') id: number, @Request() req) {
    await this.orderService.deleteOrder(id, req.user.id);
    return { message: 'Order deleted successfully' };
  }
}