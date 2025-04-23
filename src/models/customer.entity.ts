import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Address } from './address.entity';
import { Review } from './review.entity';
import { Cart } from './cart.entity';

@Entity('customer')
export class Customer {
  @PrimaryGeneratedColumn()
  customer_ID: number;

  @Column()
  customer_FullName: string;

  @Column()
  customer_Email: string;

  @Column()
  @Exclude()
  customer_Password: string;

  @Column()
  customer_PhoneNumber: string;

  @Column()
  role: number;

  @OneToMany(() => Address, address => address.customer)
  addresses: Address[];

  @OneToMany(() => Review, review => review.customer)
  reviews: Review[];

  @OneToMany(() => Cart, cart => cart.customer)
  carts: Cart[];
}