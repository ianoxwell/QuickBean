import { Venue } from '@controllers/venue/Venue.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Venue)
  venue: Venue;
}
