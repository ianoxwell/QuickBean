import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, Unique } from 'typeorm';
import { Product } from './Product.entity';
import { Modifier } from '@controllers/modifier/Modifier.entity';

@Entity()
@Unique(['product', 'modifier'])
export class ProductModifier {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  product: Product;

  @ManyToOne(() => Modifier, { eager: true, onDelete: 'CASCADE' })
  modifier: Modifier;

  @Column({ type: 'int' })
  order: number; // The order of this modifier for the product
}
