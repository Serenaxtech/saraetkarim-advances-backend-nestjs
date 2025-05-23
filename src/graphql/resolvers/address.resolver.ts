import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AddressType } from '../types/address.type';
import { CreateAddressInput, UpdateAddressInput } from '../types/address-input.type';
import { AddressService } from '../../services/address.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';

@Resolver(() => AddressType)
export class AddressResolver {
  constructor(private readonly addressService: AddressService) {}

  @Query(() => [AddressType])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(0, 1)
  async addresses(@Context() context: any): Promise<AddressType[]> {
    return this.addressService.getAddressByCustomerId(context.req.user.id);
  }

  @Query(() => AddressType)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(0, 1)
  async address(
    @Args('id', { type: () => Int }) id: number,
    @Context() context: any
  ): Promise<AddressType> {
    return this.addressService.getAddressById(id, context.req.user.id);
  }

  @Mutation(() => AddressType)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(0, 1)
  async createAddress(
    @Args('input') createAddressInput: CreateAddressInput,
    @Context() context: any
  ): Promise<AddressType> {
    return this.addressService.createAddress(context.req.user.id, createAddressInput);
  }

  @Mutation(() => AddressType)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(0, 1)
  async updateAddress(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') updateAddressInput: UpdateAddressInput,
    @Context() context: any
  ): Promise<AddressType> {
    return this.addressService.updateAddress(id, context.req.user.id, updateAddressInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(0, 1)
  async deleteAddress(
    @Args('id', { type: () => Int }) id: number,
    @Context() context: any
  ): Promise<boolean> {
    await this.addressService.deleteAddress(id, context.req.user.id);
    return true;
  }
}