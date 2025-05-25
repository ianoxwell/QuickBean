import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';

/** Seems like an okay tutorial - https://dev.to/imichaelowolabi/how-to-implement-login-with-google-in-nest-js-2aoa */
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
      callbackURL: process.env.CALL_BACK_URL,
      scope: ['email', 'profile', 'openId']
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: { name: { givenName: string; familyName: string }; emails: { value: string }[]; photos: { value: string }[] },
    done: VerifyCallback
  ) {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      name: name.givenName,
      photoUrl: photos[0].value,
      accessToken
    };
    done(null, user);
  }
}
