import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { CustomerType } from '../types/customer.type';
import { CustomerService } from '../../services/customer.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { LoginInput } from '../types/login.input';
import { ChangePasswordInput } from '../types/change-password.input';
import { CreateCustomerInput } from '../types/create-customer.input';
import { UpdateCustomerInput } from '../types/update-customer.input';
import { AuthType } from '../types/auth.type';

@Resolver(() => CustomerType)
export class CustomerResolver {
  constructor(private readonly customerService: CustomerService) {}

  @Query(() => [CustomerType])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(0)
  async customers(): Promise<CustomerType[]> {
    return this.customerService.getAllCustomers();
  }

  @Query(() => CustomerType)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(0, 1)
  async customer(@Args('id', { type: () => Int }) id: number): Promise<CustomerType> {
    return this.customerService.getCustomerById(id);
  }

  @Mutation(() => AuthType)
  async login(
    @Args('input') loginInput: LoginInput,
    @Context() context: any
  ): Promise<AuthType> {
    try {
      // Add detailed logging
      console.log('Raw login input:', loginInput);
      console.log('Input type:', typeof loginInput);
      console.log('Email type:', typeof loginInput?.email);
      console.log('Password type:', typeof loginInput?.password);

      if (!loginInput || !loginInput.email || !loginInput.password) {
        return {
          token: '',
          success: false,
          message: 'Email and password are required'
        };
      }

      console.log('Login Input:', {
        email: loginInput.email,
        hasPassword: !!loginInput.password
      });

      const { token } = await this.customerService.signIn(loginInput);
      
      // Set the cookie in the response
      context.res.cookie('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600000, // 1 hour
      });

      return {
        token,
        success: true,
        message: 'Login successful'
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        token: '',
        success: false,
        message: error.message || 'Login failed'
      };
    }
  }

  @Mutation(() => CustomerType)
  async createCustomer(@Args('input') createCustomerInput: CreateCustomerInput): Promise<CustomerType> {
    return this.customerService.createCustomer(createCustomerInput);
  }

  @Mutation(() => CustomerType)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(0)
  async createAdmin(@Args('input') createCustomerInput: CreateCustomerInput): Promise<CustomerType> {
    return this.customerService.createAdmin(createCustomerInput);
  }

  @Mutation(() => CustomerType)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(0, 1)
  async updateCustomer(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') updateCustomerInput: UpdateCustomerInput
  ): Promise<CustomerType> {
    return this.customerService.updateCustomer(id, updateCustomerInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(0, 1)
  async deleteCustomer(
    @Args('id', { type: () => Int }) id: number,
    @Args('password') password: string,
    @Context() context: any
  ): Promise<boolean> {
    await this.customerService.deleteCustomer(id, password, context.res);
    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(0, 1)
  async changePassword(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') changePasswordInput: ChangePasswordInput
  ): Promise<boolean> {
    return this.customerService.changePassword(id, changePasswordInput);
  }
}