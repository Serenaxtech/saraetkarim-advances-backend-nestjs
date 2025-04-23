import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Customer } from './customer.entity';

@Entity('address')
export class Address {
  @PrimaryGeneratedColumn()
  address_ID: number;

  @Column()
  region: string;

  @Column()
  street: string;

  @Column()
  building: string;

  @Column()
  floor: number;

  @Column()
  moreDetails: string;

  @Column()
  customer_ID: number;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customer_ID' })
  customer: Customer;
}