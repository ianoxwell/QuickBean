import { ERole, IBaseDto, TLoginProvider } from './base.dto';
import { IVenueShort } from './venue.dto';

export interface IUserProfile extends IBaseDto {
  name?: string;
  email: string;
}

export interface IUserJwtPayload {
  id: number;
  email: string;
  name?: string;
  roles: ERole[];
}

export interface INewUser {
  name?: string;
  email: string;
  loginProvider: TLoginProvider;
  roles: ERole[];
  venues?: IVenueShort[];
}

export interface IUserSummary extends IUserProfile {
  isActive: boolean;
  failedLoginAttempt: number;
  lastFailedLoginAttempt?: Date;
  timesLoggedIn: number;
  firstLogin?: Date;
  lastLogin?: Date;
  roles: ERole[];
  venues: IVenueShort[];
}

export interface IUserLogin {
  email: string;
  oneTimeCode: string;
}

export interface IUserToken {
  token: string;
  user: IUserSummary;
}

export interface IVerifyUserEmail {
  token: string;
  email: string;
}

export interface IResetPasswordRequest extends IUserLogin {
  token: string;
}

export interface IOneTimeCodeExpires {
  expires: Date;
}
