import { Product } from '@controllers/product/Product.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Checkout } from './Checkout.entity';
import { EProductType } from '@models/base.dto';

@Entity()
export class CheckoutCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  productType: EProductType;

  @Column()
  order: number;
  @Column({ default: true })
  isActive: boolean;

  @ManyToMany(() => Checkout)
  checkouts: Checkout[];

  @ManyToMany(() => Product)
  @JoinTable()
  products: Product[];
}
