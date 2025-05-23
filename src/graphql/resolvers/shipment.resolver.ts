import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ShipmentType } from '../types/shipment.type';
import { CreateShipmentInput } from '../types/shipment-input.type';
import { ShipmentService } from '../../services/shipment.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';

@Resolver(() => ShipmentType)
export class ShipmentResolver {
  constructor(private readonly shipmentService: ShipmentService) {}

  @Query(() => [ShipmentType])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(0)
  async shipments(): Promise<ShipmentType[]> {
    return this.shipmentService.getAllShipments();
  }

  @Query(() => ShipmentType)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(0, 1)
  async shipment(
    @Args('id', { type: () => Int }) id: number,
    @Context() context: any
  ): Promise<ShipmentType> {
    return this.shipmentService.getShipmentById(id);
  }

  @Mutation(() => ShipmentType)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(0)
  async createShipment(
    @Args('input') createShipmentInput: CreateShipmentInput,
    @Context() context: any
  ): Promise<ShipmentType> {
    return this.shipmentService.createShipment(createShipmentInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(0)
  async deleteShipment(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    await this.shipmentService.deleteShipment(id);
    return true;
  }
}