/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call */
import { IUserJwtPayload } from '@models/user.dto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_KEY')
    });
  }

  validate(payload: any): IUserJwtPayload {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return { userId: payload.userId, email: payload.email, name: payload.name, roles: payload.roles };
  }
}
