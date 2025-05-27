import { Product } from '@controllers/product/Product.entity';
import { ISelectedModifierOption } from '@models/modifier.dto';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './Order.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal' })
  price: number;

  @ManyToOne(() => Order, (order) => order.items)
  order: Order;

  @ManyToOne(() => Product)
  product: Product;

  @Column({ type: 'jsonb', nullable: true })
  selectedModifiers: ISelectedModifierOption[];
}
