import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from './product.entity';

@Entity('category')
export class Category {
  @PrimaryGeneratedColumn()
  category_ID: number;

  @Column()
  category_Name: string;

  @OneToMany(() => Product, product => product.category)
  products: Product[];
}