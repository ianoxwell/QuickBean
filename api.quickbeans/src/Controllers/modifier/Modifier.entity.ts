import { ProductModifier } from '@controllers/product/ProductModifierJoin.entity';
import { Venue } from '@controllers/venue/Venue.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Modifier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: false })
  name: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isRequired: boolean; // indicates if this modifier must be selected for the product

  @OneToMany(() => ModifierOption, (option) => option.modifier, { cascade: true })
  options: ModifierOption[];

  @OneToMany(() => ProductModifier, (pm) => pm.modifier)
  productModifiers: ProductModifier[];

  @ManyToOne(() => Venue, { nullable: false })
  venue!: Venue;
}

@Entity()
export class ModifierOption {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: true })
  isActive: boolean;

  @Column()
  label: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'decimal', nullable: true })
  priceAdjustment?: number; // can be positive or negative

  @Column({ type: 'decimal', nullable: true })
  percentAdjustment?: number; // relates directly to the base cost of the product

  @Column({ default: false })
  isDefault: boolean;

  @ManyToOne(() => Modifier, (modifier) => modifier.options)
  modifier: Modifier;
}
