import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ShipmentService } from '../services/shipment.service';
import { CreateShipmentDto } from '../dto/shipment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('shipments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ShipmentController {
  constructor(private readonly shipmentService: ShipmentService) {}

  @Get()
  @Roles(0)
  async getAllShipments() {
    return this.shipmentService.getAllShipments();
  }

  @Get(':id')
  @Roles(0)
  async getShipmentById(@Param('id') id: number) {
    return this.shipmentService.getShipmentById(id);
  }

  @Get('customer/:customerId')
  @Roles(0, 1)
  async getShipmentsByCustomerId(@Param('customerId') customerId: number, @Request() req) {
    const targetId = req.user.role === 'admin' ? customerId : req.user.id;
    return this.shipmentService.getShipmentsByCustomerId(targetId);
  }

  @Post()
  @Roles(0)
  async createShipment(@Body() shipmentData: CreateShipmentDto) {
    return this.shipmentService.createShipment(shipmentData);
  }

  @Delete(':id')
  @Roles(0)
  async deleteShipment(@Param('id') id: number) {
    await this.shipmentService.deleteShipment(id);
    return { message: 'Shipment deleted successfully' };
  }
}