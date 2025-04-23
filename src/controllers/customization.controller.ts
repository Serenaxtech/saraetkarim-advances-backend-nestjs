import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CustomizationService } from '../services/customization.service';
import { CreateCustomizationDto, UpdateCustomizationDto } from '../dto/customization.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('customizations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CustomizationController {
  constructor(private readonly customizationService: CustomizationService) {}

  @Get()
  @Roles(0, 1)
  async getAllCustomizations() {
    return this.customizationService.getAllCustomizations();
  }

  @Get(':id')
  @Roles(0, 1)
  async getCustomizationById(@Param('id') id: number) {
    return this.customizationService.getCustomizationById(id);
  }

  @Post()
  @Roles(0)
  async createCustomization(@Body() customizationData: CreateCustomizationDto) {
    const result = await this.customizationService.createCustomization(customizationData);
    return {
      message: 'Customization created successfully',
      data: result
    };
  }

  @Put(':id')
  @Roles(0)
  async updateCustomization(
    @Param('id') id: number,
    @Body() customizationData: UpdateCustomizationDto,
  ) {
    const result = await this.customizationService.updateCustomization(id, customizationData);
    return {
      message: 'Customization updated successfully',
      data: result
    };
  }

  @Delete(':id')
  @Roles(0)
  async deleteCustomization(@Param('id') id: number) {
    await this.customizationService.deleteCustomization(id);
    return {
      message: 'Customization deleted successfully',
      statusCode: 200
    };
  }
}