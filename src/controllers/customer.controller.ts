import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, Res } from '@nestjs/common';
import { CustomerService } from '../services/customer.service';
import { CreateCustomerDto, UpdateCustomerDto, LoginDto, ChangePasswordDto } from '../dto/customer.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Response } from 'express';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(0)
  async getAllCustomers(@Request() req) {
    console.log('User from request:', req.user); // Add this for debugging
    return this.customerService.getAllCustomers();
  }

  @Post()
  async createCustomer(@Body() customerData: CreateCustomerDto) {
    await this.customerService.createCustomer(customerData);
    return { message: 'Customer created successfully' };
  }

  @Post('admin')
  async createAdmin(@Body() customerData: CreateCustomerDto) {
    await this.customerService.createAdmin(customerData);
    return { message: 'Admin created successfully' };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(0, 1)
  async getCustomerById(@Param('id') id: number, @Request() req) {
    const targetId = req.user.role === 0 ? id : req.user.id;
    return this.customerService.getCustomerById(targetId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(0, 1)
  async updateCustomer(
    @Param('id') id: number,
    @Body() customerData: UpdateCustomerDto,
    @Request() req,
  ) {
    const targetId = req.user.role === 0 ? id : req.user.id;
    await this.customerService.updateCustomer(targetId, customerData);
    return { message: 'Customer updated successfully' };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(0, 1)
  async deleteCustomer(
    @Param('id') id: number,
    @Body('customer_Password') password: string,
    @Request() req,
  ) {
    const targetId = req.user.role === 0 ? id : req.user.id;
    await this.customerService.deleteCustomer(targetId, password);
    return { message: 'Customer deleted successfully' };
  }

  @Put(':id/change/password')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(0, 1)
  async changePassword(
    @Param('id') id: number,
    @Body() passwordData: ChangePasswordDto,
    @Request() req,
  ) {
    const targetId = req.user.role === 0 ? id : req.user.id;
    await this.customerService.changePassword(targetId, passwordData);
    return { message: 'Customer password changed successfully' };
  }

  @Post('signin')
  async signIn(@Body() loginData: LoginDto, @Res({ passthrough: true }) response: Response) {
    const { token } = await this.customerService.signIn(loginData);
    
    response.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000,
    });

    return { token };
  }

  @Get('check/auth')
  @UseGuards(JwtAuthGuard)
  async checkAuth(@Request() req) {
    console.log(req.user.id);
    return {
      isAuthenticated: true,
      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role === 0 ? 'admin' : 'user',
      },
    };
  }
}