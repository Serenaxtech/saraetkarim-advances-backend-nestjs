import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Customer } from './customer.entity';
import { Product } from './product.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn()
  review_ID: number;

  @Column()
  customer_ID: number;

  @Column()
  product_ID: number;

  @Column()
  rating: number;

  @Column()
  review_Text: string;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customer_ID' })
  customer: Customer;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_ID' })
  product: Product;
}