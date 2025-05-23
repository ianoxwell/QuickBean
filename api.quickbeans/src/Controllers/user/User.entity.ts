import { Venue } from '@controllers/venue/Venue.entity';
import { Role } from '@models/base.dto';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column()
  passwordHash: string;

  @Column({ default: true })
  isActive: boolean;

  @Column()
  loginProvider: 'google' | 'local';

  @Column({ nullable: true })
  resetToken: string;

  @Column({ nullable: true })
  resetTokenExpires: Date;

  @Column('simple-array')
  roles: Role[];

  @ManyToMany(() => Venue)
  @JoinTable()
  venues: Venue[];
}
