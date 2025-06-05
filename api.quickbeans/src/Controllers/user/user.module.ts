import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomLogger } from '@services/logger.service';
import { JwtStrategy } from 'src/Services/auth/jwt.strategy';
import { AccountController } from './user.controller';
import { User } from './User.entity';
import { UserService } from './user.service';
import { VenueModule } from '@controllers/venue/venue.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_KEY'),
        signOptions: { expiresIn: '12h' }
      }),
      inject: [ConfigService]
    }),
    VenueModule
  ],
  controllers: [AccountController],
  providers: [UserService, JwtStrategy, CustomLogger],
  exports: [UserService]
})
export class UserModule {}
