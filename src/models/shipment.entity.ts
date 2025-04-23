import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './orders.entity';
import { Customer } from './customer.entity';

@Entity('shipment')
export class Shipment {
  @PrimaryGeneratedColumn()
  shipment_ID: number;

  @Column()
  order_ID: number;

  @Column()
  customer_ID: number;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_ID' })
  order: Order;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customer_ID' })
  customer: Customer;
}