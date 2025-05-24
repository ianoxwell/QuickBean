import { Venue } from '@controllers/venue/Venue.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Modifier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: false })
  name: string;

  @OneToMany(() => ModifierOption, (option) => option.modifier, { cascade: true })
  options: ModifierOption[];

  @ManyToOne(() => Venue, { nullable: false })
  venue!: Venue;
}

@Entity()
export class ModifierOption {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  label: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'decimal', nullable: true })
  priceAdjustment?: number; // can be positive or negative

  @Column({ type: 'decimal', nullable: true })
  percentAdjustment?: number;

  @ManyToOne(() => Modifier, (modifier) => modifier.options)
  modifier: Modifier;
}
