import { ERole, IBaseDto, TLoginProvider } from './base.dto';
import { IVenueShort } from './venue.dto';

export interface IUserProfile extends IBaseDto {
  name: string;
  email: string;
  phone?: string;
}

export interface IUserJwtPayload {
  id: number;
  email: string;
  name: string;
  roles: ERole[];
}

export interface INewUser {
  name: string;
  email: string;
  phone?: string;
  password?: string;
  photoUrl?: string;
  loginProvider: TLoginProvider;
  verified?: Date;
  roles: ERole[];
  venues?: IVenueShort[];
}

export interface IUserSummary extends IUserProfile {
  photoUrl: string;
  isActive: boolean;
  loginProvider: string;
  verified?: Date;
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
  password: string;
}

export interface IUserToken {
  token: string;
  user: IUserSummary;
}

export interface IVerifyUserEmail {
  token: string;
  email: string;
}
