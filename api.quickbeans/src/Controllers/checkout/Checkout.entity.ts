import { Venue } from '@controllers/venue/Venue.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CheckoutCategory } from './CheckoutCategory.entity';

@Entity()
export class Checkout {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  slug!: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  backgroundImageUrl: string;

  @Column({ nullable: true })
  heroImage: string;

  @ManyToOne(() => Venue)
  venue: Venue;

  @OneToMany(() => CheckoutCategory, (category) => category.checkout, {
    cascade: true
  })
  categories: CheckoutCategory[];
}
