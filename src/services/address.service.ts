import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from '../models/address.entity';
import { CreateAddressDto, UpdateAddressDto } from '../dto/address.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
  ) {}

  async getAllAddresses(): Promise<Address[]> {
    return this.addressRepository.find({
      relations: ['customer'],
    });
  }

  async getAddressById(id: number, customerId: number): Promise<Address> {
    const address = await this.addressRepository.findOne({
      where: { address_ID: id, customer_ID: customerId },
      relations: ['customer'],
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }
    return address;
  }

  async getAddressByCustomerId(customerId: number): Promise<Address[]> {
    const addresses = await this.addressRepository.find({
      where: { customer_ID: customerId },
      relations: ['customer'],
    });

    if (!addresses.length) {
      throw new NotFoundException('No addresses found for this customer');
    }
    return addresses;
  }

  async createAddress(customerId: number, addressData: CreateAddressDto): Promise<Address> {
    const address = this.addressRepository.create({
      ...addressData,
      customer_ID: customerId,
    });
    return this.addressRepository.save(address);
  }

  async updateAddress(id: number, customerId: number, addressData: UpdateAddressDto): Promise<Address> {
    const address = await this.addressRepository.findOne({
      where: { address_ID: id, customer_ID: customerId },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    Object.assign(address, addressData);
    return this.addressRepository.save(address);
  }

  async deleteAddress(id: number, customerId: number): Promise<void> {
    const result = await this.addressRepository.delete({
      address_ID: id,
      customer_ID: customerId,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Address not found');
    }
  }
}