import { Injectable, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../models/customer.entity';
import { CreateCustomerDto, UpdateCustomerDto, LoginDto, ChangePasswordDto } from '../dto/customer.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';

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

  async deleteCustomer(id: number, password: string, response: Response): Promise<void> {
    if (!password || typeof password !== 'string') {
      throw new BadRequestException('Password is required');
    }

    const customer = await this.customerRepository.findOne({
      where: { customer_ID: id },
      select: ['customer_ID', 'customer_Password', 'customer_Email'] 
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    try {
      const isPasswordValid = await bcrypt.compare(password, customer.customer_Password);
      
      if (!isPasswordValid) {
        throw new UnauthorizedException('Incorrect password');
      }

      // Delete addresses and clear cookie
      await this.customerRepository.manager.transaction(async transactionalEntityManager => {
        await transactionalEntityManager.query(
          'DELETE FROM address WHERE customer_ID = ?',
          [id]
        );

        // Clear the authentication cookie
        response.clearCookie('authToken', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/'
        });
      });

    } catch (error) {
      console.error('Error deleting customer addresses:', error);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete customer addresses');
    }
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
    console.log('Login attempt with:',  { email: loginData.email, password: !!loginData.password });
    console.log(loginData);
    const customer = await this.customerRepository.findOne({
      where: { customer_Email: loginData.email },
    });
    console.log('Found customer:', !!customer);

    if (!customer) {
      throw new UnauthorizedException('Invalid credentials');
    }

    console.log('Customer password exists:', !!customer.customer_Password);
    const isPasswordValid = await bcrypt.compare(loginData.password, customer.customer_Password);
    console.log(customer.customer_Password);
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