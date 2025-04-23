import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customization } from '../models/customization.entity';
import { CreateCustomizationDto, UpdateCustomizationDto } from '../dto/customization.dto';

@Injectable()
export class CustomizationService {
  constructor(
    @InjectRepository(Customization)
    private customizationRepository: Repository<Customization>,
  ) {}

  async getAllCustomizations(): Promise<Customization[]> {
    return this.customizationRepository.find({
      relations: ['product'],
    });
  }

  async getCustomizationById(id: number): Promise<Customization> {
    const customization = await this.customizationRepository.findOne({
      where: { customization_ID: id },
      relations: ['product'],
    });

    if (!customization) {
      throw new NotFoundException('Customization not found');
    }
    return customization;
  }

  async createCustomization(customizationData: CreateCustomizationDto): Promise<Customization> {
    const customization = this.customizationRepository.create({
      customization_Size: Math.floor(customizationData.size), // Ensure integer
      customization_Color: customizationData.color,
      product_ID: customizationData.product_ID,
    });
    return this.customizationRepository.save(customization);
  }

  async updateCustomization(id: number, customizationData: UpdateCustomizationDto): Promise<Customization> {
    const customization = await this.getCustomizationById(id);
    
    customization.customization_Size = Math.floor(customizationData.size); // Ensure integer
    customization.customization_Color = customizationData.color;
    customization.product_ID = customizationData.product_ID;

    return this.customizationRepository.save(customization);
  }

  async deleteCustomization(id: number): Promise<void> {
    const result = await this.customizationRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Customization not found');
    }
  }
}