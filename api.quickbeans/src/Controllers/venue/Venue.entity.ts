import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Venue {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ unique: true, length: 255, nullable: false })
  name!: string;

  @Index()
  @Column({ unique: true, length: 255, nullable: false })
  slug!: string;

  @Column()
  websiteUrl: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  logoImage: string;

  @Column()
  countryId: string;

  @Column({ type: 'jsonb' })
  openingHours: { day: number; open: number; close: number }[];

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  postcode: string;

  @Column()
  publicPhone: string;

  @Column()
  legalBusinessName: string;

  @Column()
  legalBusinessNumber: string;

  @Column()
  timezone: string;

  @Column()
  privacyPolicy: string;
}
