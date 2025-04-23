import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shipment } from '../models/shipment.entity';
import { CreateShipmentDto } from '../dto/shipment.dto';

@Injectable()
export class ShipmentService {
  constructor(
    @InjectRepository(Shipment)
    private shipmentRepository: Repository<Shipment>,
  ) {}

  async getAllShipments(): Promise<Shipment[]> {
    return this.shipmentRepository.find({
      relations: ['order', 'customer'],
    });
  }

  async getShipmentById(id: number): Promise<Shipment> {
    const shipment = await this.shipmentRepository.findOne({
      where: { shipment_ID: id },
      relations: ['order', 'customer'],
    });

    if (!shipment) {
      throw new NotFoundException('Shipment not found');
    }

    return shipment;
  }

  async createShipment(shipmentData: CreateShipmentDto): Promise<Shipment> {
    const shipment = this.shipmentRepository.create(shipmentData);
    return this.shipmentRepository.save(shipment);
  }

  async deleteShipment(id: number): Promise<void> {
    const result = await this.shipmentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Shipment not found');
    }
  }

  async getShipmentsByCustomerId(customerId: number): Promise<Shipment[]> {
    return this.shipmentRepository.find({
      where: { customer_ID: customerId },
      relations: ['order'],
    });
  }
}