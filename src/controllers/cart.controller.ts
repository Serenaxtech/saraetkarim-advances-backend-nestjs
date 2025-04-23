import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CartService } from '../services/cart.service';
import { CreateCartDto, UpdateCartDto } from '../dto/cart.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('cart')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @Roles(0)
  async getAllCarts() {
    return this.cartService.getAllCarts();
  }

  @Get(':id')
  @Roles(0, 1)
  async getCartById(@Param('id') id: number) {
    return this.cartService.getCartById(id);
  }

  @Get('customer/:customerId')
  @Roles(0, 1)
  async getCartItemsByCustomerId(
    @Param('customerId') customerId: number,
    @Request() req
  ) {
    // If admin, can get any customer's cart items. If user, can only get their own
    const targetCustomerId = req.user.role === 0 ? customerId : req.user.id;
    return this.cartService.getActiveCartsByCustomerId(targetCustomerId);
  }

  @Post()
  @Roles(0, 1)
  async addToCart(@Body() cartData: CreateCartDto, @Request() req) {
    return this.cartService.addToCart(req.user.id, cartData);
  }

  @Put(':id')
  @Roles(0, 1)
  async updateCartItem(
    @Param('id') id: number,
    @Body() cartData: UpdateCartDto,
    @Request() req,
  ) {
    return this.cartService.updateCartItem(id, req.user.id, cartData);
  }

  @Delete(':id')
  @Roles(0, 1)
  async deleteCartItem(@Param('id') id: number, @Request() req) {
    return this.cartService.deleteCartItem(id, req.user.id);
  }

  @Get('total')
  @Roles(0, 1)
  async calculateTotal(@Request() req) {
    console.log(req.user.id);
    const total = await this.cartService.calculateTotal(req.user.id);
    return { total };
  }
}