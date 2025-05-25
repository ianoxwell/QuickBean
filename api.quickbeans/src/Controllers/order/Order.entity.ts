import { User } from '@controllers/user/User.entity';
import { Venue } from '@controllers/venue/Venue.entity';
import { EBookingStatus } from '@models/base.dto';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OrderItem } from './OrderItem.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Venue)
  venue: Venue;

  @ManyToOne(() => User)
  patron: User;

  @Column()
  orderDate: Date;

  @Column()
  receiptNumber: string;

  @Column({ type: 'decimal' })
  amountPaid: number;

  @Column({ type: 'decimal' })
  grandTotal: number;

  @Column({ type: 'decimal', nullable: true })
  discount: number;

  @Column({ nullable: true })
  comments: string;

  @Column({ type: 'enum', enum: EBookingStatus })
  bookingStatus: EBookingStatus;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];
}
