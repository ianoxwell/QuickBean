import { Venue } from '@controllers/venue/Venue.entity';
import { ERole, TLoginProvider } from '@models/base.dto';
import { Column, Entity, Index, JoinTable, ManyToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: true })
  name: string;

  @Index()
  @Column({ unique: true })
  email!: string;

  @Column({ default: true })
  isActive: boolean;

  @Column()
  loginProvider: TLoginProvider;

  @Column({ type: 'int', default: 0 })
  failedLoginAttempt?: number;

  @Column({ type: 'timestamp with time zone', nullable: true })
  lastFailedLoginAttempt?: Date;

  @Column({ type: 'int', default: 0 })
  timesLoggedIn: number;

  @Column({ type: 'timestamp with time zone', nullable: true })
  firstLogin?: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  lastLogin?: Date;

  /** Token content */
  @Column({ length: 200, nullable: true })
  oneTimeCode?: string;

  @Column({ type: 'timestamp with time zone', nullable: true })
  oneTimeCodeExpires?: Date;

  /** Roles and venues */
  @Column('simple-array')
  roles: ERole[];

  @ManyToMany(() => Venue)
  @JoinTable()
  venues: Venue[];
}
