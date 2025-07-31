import { User } from '@controllers/user/User.entity';
import { Venue } from '@controllers/venue/Venue.entity';
import { EOrderStatus } from '@models/base.dto';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Index } from 'typeorm';
import { OrderItem } from './OrderItem.entity';
import { Checkout } from '@controllers/checkout/Checkout.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'timestamp' })
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

  @Column({ type: 'enum', enum: EOrderStatus, default: EOrderStatus.PENDING })
  orderStatus: EOrderStatus;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true, eager: false })
  items: OrderItem[];

  @Index()
  @ManyToOne(() => Venue)
  venue: Venue;

  @Index()
  @ManyToOne(() => User)
  patron: User;

  @Index()
  @ManyToOne(() => Checkout)
  checkout: Checkout;
}
