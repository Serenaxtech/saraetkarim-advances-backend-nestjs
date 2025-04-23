import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('customization')
export class Customization {
  @PrimaryGeneratedColumn()
  customization_ID: number;

  @Column()
  customization_Size: number;

  @Column()
  customization_Color: string;

  @Column()
  product_ID: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_ID' })
  product: Product;
}