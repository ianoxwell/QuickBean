import { Modifier } from '@controllers/modifier/Modifier.entity';
import { Venue } from '@controllers/venue/Venue.entity';
import { ProductType } from '@models/base.dto';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Venue, { nullable: false })
  venue: Venue;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column('decimal')
  baseCost: number;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'enum', enum: ProductType })
  productType: ProductType;

  @ManyToMany(() => Modifier, { cascade: true })
  @JoinTable()
  modifiers: Modifier[];
}
