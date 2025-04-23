import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Category } from './category.entity';
import { Review } from './review.entity';
import { Customization } from './customization.entity';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn()
  product_ID: number;

  @Column()
  product_Name: string;

  @Column()
  product_IMG: string;

  @Column()
  product_Description: string;

  @Column()
  product_Info: string;

  @Column('decimal', { precision: 10, scale: 2 })
  product_Price: number;

  @Column()
  category_ID: number;

  @Column()
  stock_quantity: number;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_ID' })
  category: Category;

  @OneToMany(() => Review, review => review.product)
  reviews: Review[];

  @OneToMany(() => Customization, customization => customization.product)
  customizations: Customization[];
}