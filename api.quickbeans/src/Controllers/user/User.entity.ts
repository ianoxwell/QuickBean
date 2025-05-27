import { Venue } from '@controllers/venue/Venue.entity';
import { ERole, TLoginProvider } from '@models/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, JoinTable, ManyToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  @Index()
  @Column({ unique: true })
  email!: string;

  @Index()
  @Column({ nullable: true })
  phone: string;
  @Column({ nullable: true })
  photoUrl?: string;

  @Column({ length: 200, nullable: true })
  passwordHash: string;

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
  verificationToken?: string;

  @Column({ length: 200, nullable: true })
  resetToken?: string;

  @Column({ type: 'timestamp with time zone', nullable: true })
  resetTokenExpires?: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  passwordLastReset?: Date;

  @ApiProperty({
    description: 'Has date implies that the user has been verified.'
  })
  @Column({ type: 'timestamp with time zone', nullable: true })
  verified?: Date;

  @Column({ type: 'simple-array', nullable: true })
  refreshTokens?: string[];

  /** Roles and venues */

  @Column('simple-array')
  roles: ERole[];

  @ManyToMany(() => Venue)
  @JoinTable()
  venues: Venue[];
}
