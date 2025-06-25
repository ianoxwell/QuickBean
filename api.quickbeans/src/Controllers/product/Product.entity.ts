import { Venue } from '@controllers/venue/Venue.entity';
import { EProductType } from '@models/base.dto';
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductModifier } from './ProductModifierJoin.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id?: number;

  @Index()
  @Column({ unique: false })
  name: string;

  @Column()
  description: string;

  @Column('decimal')
  baseCost: number;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'enum', enum: EProductType })
  productType: EProductType;

  @ManyToOne(() => Venue, { nullable: false })
  @Index()
  venue!: Venue;

  @OneToMany(() => ProductModifier, (pm) => pm.product, { cascade: true, eager: true })
  productModifiers: ProductModifier[];
}
