import { Injectable, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../models/customer.entity';
import { CreateCustomerDto, UpdateCustomerDto, LoginDto, ChangePasswordDto } from '../dto/customer.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    private jwtService: JwtService,
  ) {}

  async getAllCustomers(): Promise<Customer[]> {
    return this.customerRepository.find();
  }

  async createCustomer(customerData: CreateCustomerDto): Promise<Customer> {
    const hashedPassword = await bcrypt.hash(customerData.password, 10);
    const customer = this.customerRepository.create({
      customer_FullName: customerData.name,
      customer_Email: customerData.email,
      customer_Password: hashedPassword,
      customer_PhoneNumber: customerData.number,
      role: 1, // Regular user
    });
    return this.customerRepository.save(customer);
  }

  async createAdmin(customerData: CreateCustomerDto): Promise<Customer> {
    const hashedPassword = await bcrypt.hash(customerData.password, 10);
    const customer = this.customerRepository.create({
      customer_FullName: customerData.name,
      customer_Email: customerData.email,
      customer_Password: hashedPassword,
      customer_PhoneNumber: customerData.number,
      role: 0, // Admin
    });
    return this.customerRepository.save(customer);
  }

  async getCustomerById(id: number): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { customer_ID: id },
    });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return customer;
  }

  async updateCustomer(id: number, customerData: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.getCustomerById(id);
    
    customer.customer_FullName = customerData.name;
    customer.customer_Email = customerData.email;
    customer.customer_PhoneNumber = customerData.number;

    return this.customerRepository.save(customer);
  }

  async deleteCustomer(id: number, password: string): Promise<void> {
    const customer = await this.getCustomerById(id);
    const isPasswordValid = await bcrypt.compare(password, customer.customer_Password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Incorrect password');
    }

    await this.customerRepository.remove(customer);
  }

  async changePassword(id: number, data: ChangePasswordDto): Promise<boolean> {
    const customer = await this.customerRepository.findOne({
      where: { customer_ID: id, customer_Email: data.email },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const isOldPasswordValid = await bcrypt.compare(data.old_password, customer.customer_Password);
    if (!isOldPasswordValid) {
      throw new UnauthorizedException('Incorrect old password');
    }

    const hashedNewPassword = await bcrypt.hash(data.new_password, 10);
    customer.customer_Password = hashedNewPassword;
    await this.customerRepository.save(customer);
    return true;
  }

  async signIn(loginData: LoginDto): Promise<{ token: string }> {
    const customer = await this.customerRepository.findOne({
      where: { customer_Email: loginData.email },
    });

    if (!customer) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginData.password, customer.customer_Password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      id: customer.customer_ID,
      email: customer.customer_Email,
      role: customer.role,
    };

    return {
      token: this.jwtService.sign(payload),
    };
  }
}