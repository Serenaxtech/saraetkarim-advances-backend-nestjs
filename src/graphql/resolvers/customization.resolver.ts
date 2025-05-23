import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CustomizationType } from '../types/customization.type';
import { CreateCustomizationInput, UpdateCustomizationInput } from '../types/customization-input.type';
import { CustomizationService } from '../../services/customization.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';

@Resolver(() => CustomizationType)
export class CustomizationResolver {
  constructor(private readonly customizationService: CustomizationService) {}

  @Query(() => [CustomizationType])
  async customizations(): Promise<CustomizationType[]> {
    return this.customizationService.getAllCustomizations();
  }

  @Query(() => [CustomizationType])
  async productCustomizations(
    @Args('productId', { type: () => Int }) productId: number
  ): Promise<CustomizationType[]> {
    return this.customizationService.getCustomizationsByProductId(productId);
  }

  @Query(() => CustomizationType)
  async customization(@Args('id', { type: () => Int }) id: number): Promise<CustomizationType> {
    return this.customizationService.getCustomizationById(id);
  }

  @Mutation(() => CustomizationType)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(0)
  async createCustomization(
    @Args('input') createCustomizationInput: CreateCustomizationInput
  ): Promise<CustomizationType> {
    const dto = {
      size: createCustomizationInput.customization_Size,
      color: createCustomizationInput.customization_Color,
      product_ID: createCustomizationInput.product_ID
    };
    return this.customizationService.createCustomization(dto);
  }

  @Mutation(() => CustomizationType)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(0)
  async updateCustomization(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') updateCustomizationInput: UpdateCustomizationInput
  ): Promise<CustomizationType> {
    const dto = {
      size: updateCustomizationInput.customization_Size,
      color: updateCustomizationInput.customization_Color,
      product_ID: updateCustomizationInput.product_ID
    };
    return this.customizationService.updateCustomization(id, dto);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(0)
  async deleteCustomization(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    await this.customizationService.deleteCustomization(id);
    return true;
  }
}