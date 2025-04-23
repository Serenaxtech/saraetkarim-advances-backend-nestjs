import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Customer } from './customer.entity';
import { Product } from './product.entity';
import { Order } from './orders.entity';

@Entity('cart')
export class Cart {
  @PrimaryGeneratedColumn()
  cart_ID: number;

  @Column()
  customer_ID: number;

  @Column()
  product_ID: number;

  @Column()
  quantity: number;

  @Column()
  status: string;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customer_ID' })
  customer: Customer;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_ID' })
  product: Product;

  @OneToMany(() => Order, order => order.cart)
  orders: Order[];
}