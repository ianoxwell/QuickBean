import { Modifier } from '@controllers/modifier/Modifier.entity';
import { Venue } from '@controllers/venue/Venue.entity';
import { EProductType } from '@models/base.dto';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: false })
  name: string;

  @Column()
  description: string;

  @Column('decimal')
  baseCost: number;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'enum', enum: EProductType })
  productType: EProductType;

  @ManyToOne(() => Venue, { nullable: false })
  venue!: Venue;

  @ManyToMany(() => Modifier, { cascade: true })
  @JoinTable()
  modifiers: Modifier[];
}
