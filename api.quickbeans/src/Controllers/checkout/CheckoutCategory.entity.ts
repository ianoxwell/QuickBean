import { Product } from '@controllers/product/Product.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Checkout } from './Checkout.entity';

@Entity()
export class CheckoutCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  order: number;
  @Column({ default: true })
  isActive: boolean;

  @ManyToMany(() => Checkout)
  @JoinTable()
  checkouts: Checkout[];

  @ManyToMany(() => Product)
  @JoinTable()
  products: Product[];
}
