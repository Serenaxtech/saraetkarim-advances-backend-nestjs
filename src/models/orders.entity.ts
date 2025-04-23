import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Cart } from './cart.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  order_ID: number;

  @Column()
  cart_ID: number;

  @ManyToOne(() => Cart)
  @JoinColumn({ name: 'cart_ID' })
  cart: Cart;
}