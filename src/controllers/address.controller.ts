import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AddressService } from '../services/address.service';
import { CreateAddressDto, UpdateAddressDto } from '../dto/address.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('address')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get()
  @Roles(0)
  async getAllAddresses() {
    return this.addressService.getAllAddresses();
  }

  @Get(':id')
  @Roles(0, 1)
  async getAddressById(@Param('id') id: number, @Request() req) {
    return this.addressService.getAddressById(id, req.user.id);
  }

  @Get('customer/:customerId')
  @Roles(0, 1)
  async getAddressByCustomerId(@Param('customerId') customerId: number, @Request() req) {
    // If admin, can get any customer's addresses. If user, can only get their own
    const targetCustomerId = req.user.role === 'admin' ? customerId : req.user.id;
    return this.addressService.getAddressByCustomerId(targetCustomerId);
  }

  @Post()
  @Roles(0, 1)
  async createAddress(@Body() addressData: CreateAddressDto, @Request() req) {
    return this.addressService.createAddress(req.user.id, addressData);
  }

  @Put(':id')
  @Roles(0, 1)
  async updateAddress(
    @Param('id') id: number,
    @Body() addressData: UpdateAddressDto,
    @Request() req,
  ) {
    return this.addressService.updateAddress(id, req.user.id, addressData);
  }

  @Delete(':id')
  @Roles(0, 1)
  async deleteAddress(@Param('id') id: number, @Request() req) {
    await this.addressService.deleteAddress(id, req.user.id);
    return { 
      message: 'Address deleted successfully',
      statusCode: 200
    };
  }
}