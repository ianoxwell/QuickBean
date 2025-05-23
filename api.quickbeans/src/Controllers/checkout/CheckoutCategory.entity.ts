import { Product } from '@controllers/product/Product.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Checkout } from './Checkout.entity';

@Entity()
export class CheckoutCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  order: number;

  @ManyToOne(() => Checkout)
  checkout: Checkout;

  @ManyToMany(() => Product)
  @JoinTable()
  products: Product[];
}
