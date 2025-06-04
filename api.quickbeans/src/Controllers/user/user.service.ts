import { CMessage } from '@base/message.class';
import { Venue } from '@controllers/venue/Venue.entity';
import { VenueService } from '@controllers/venue/venue.service';
import { ERole } from '@models/base.dto';
import { INewUser, IOneTimeCodeExpires, IUserLogin, IUserProfile, IUserSummary, IUserToken } from '@models/user.dto';
import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomLogger } from '@services/logger.service';
import { createDigitPin, getCurrentTimePlusMinutes } from '@services/utils';
import { Repository } from 'typeorm';
import { User } from './User.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
    // private mailService: MailService,
    private readonly jwtTokenService: JwtService,
    private venuesService: VenueService,
    private logger: CustomLogger
  ) {}

  /** Checks the email address to find out if the email address has been registered */
  async emailAvailable(email: string): Promise<boolean> {
    // , verified: Not(IsNull())
    const findExistingUser = await this.repository.findOne({ where: { email, isActive: true } });
    return findExistingUser === null;
  }

  async findByIdEntity(id: number): Promise<User | null> {
    const user = await this.repository.findOne({ where: { id, isActive: true } });
    return user || null;
  }

  async registerUser(user: INewUser, host?: string): Promise<IOneTimeCodeExpires> {
    this.logger.log(`Registering user with email: ${user.email}, host: ${host}`);

    const existNonVerifiedUser = await this.repository.findOne({ where: { email: user.email, isActive: true } });
    if (existNonVerifiedUser) {
      const updatedUser = {
        ...existNonVerifiedUser,
        oneTimeCode: createDigitPin(6),
        oneTimeCodeExpires: getCurrentTimePlusMinutes(10),
        isActive: true
      };
      // send email
      // this.mailService.sendRegistrationEmail(user.email, user.givenNames, existNonVerifiedUser.verificationToken, host);
      const mergedUser = this.repository.merge(existNonVerifiedUser, updatedUser);
      const savedUser = await this.repository.save(mergedUser);

      return { expires: savedUser.oneTimeCodeExpires };
    }

    const venues = await Promise.all(
      (user.venues || []).map(async (venue) => {
        return await this.venuesService.findByIdEntity(venue.id);
      })
    );

    const newUser: Partial<User> = {
      name: '',
      email: user.email,
      isActive: true,
      loginProvider: user.loginProvider || 'local',
      firstLogin: null,
      lastLogin: null,
      timesLoggedIn: 0,
      oneTimeCode: createDigitPin(6),
      oneTimeCodeExpires: getCurrentTimePlusMinutes(10),
      roles: user.roles || [ERole.PATRON],
      venues
    };

    const freshUser = await this.repository.save(newUser);

    return { expires: freshUser.oneTimeCodeExpires };
  }

  // token: this.createToken(freshUser)

  async createUserEntity(user: IUserProfile, venue: Venue): Promise<User> {
    const existingUser = await this.repository.findOne({ where: { email: user.email, isActive: true } });
    if (existingUser) {
      return existingUser;
    }

    const newUser = this.repository.create({
      email: user.email,
      isActive: true,
      loginProvider: 'local',
      oneTimeCode: createDigitPin(6),
      oneTimeCodeExpires: getCurrentTimePlusMinutes(10),
      roles: [ERole.PATRON],
      venues: [venue]
    });

    const savedUser = await this.repository.save(newUser);
    this.logger.log(`Created new user: ${savedUser.name} with email: ${savedUser.email}`);
    return savedUser;
  }

  async findById(id: number): Promise<IUserSummary | undefined> {
    const user = await this.repository.findOne({ where: { id } });
    if (!user || !user.isActive) {
      return undefined;
    }

    return this.mapUserToSummary(user);
  }

  /** Only to be used by the auth service */
  async verifyOneTimeCode(basicAuth: IUserLogin): Promise<IUserToken | CMessage> {
    const user = await this.repository.findOne({ where: { email: basicAuth.email } });
    if (!user) {
      return { message: 'No such email address found.', status: HttpStatus.NOT_FOUND };
    }

    if (!user.isActive || !['ros', 'Local'].includes(user.loginProvider)) {
      return {
        message: !user.isActive ? 'Account has been deactivated' : 'Try logging in with Social provider (Google)',
        status: HttpStatus.UNAUTHORIZED
      };
    }

    if (user.failedLoginAttempt > 3) {
      user.isActive = false;
      await this.repository.update(user.id, user);
      return {
        message: 'Account has been locked out and deactivated - contact your friendly IT support person.',
        status: HttpStatus.UNAUTHORIZED
      };
    }

    if (user.lastFailedLoginAttempt) {
      const timeNow = new Date().getTime();
      const lockoutTime = user.lastFailedLoginAttempt.getTime() + 6 * 1000;
      if (lockoutTime > timeNow) {
        return { message: 'Too fast speedy, have a think, slow down a little.', status: HttpStatus.TOO_MANY_REQUESTS };
      }
    }

    if (
      !basicAuth.oneTimeCode ||
      !user.oneTimeCode ||
      !user.oneTimeCodeExpires ||
      user.oneTimeCodeExpires.getTime() < new Date().getTime()
      // commenting this out to allow login without pin code
      // user.oneTimeCode !== basicAuth.oneTimeCode
    ) {
      user.failedLoginAttempt++;
      user.lastFailedLoginAttempt = new Date();

      await this.repository.update(user.id, user);
      return { message: 'Wrong pin code, have another look and try again in a bit.', status: HttpStatus.UNAUTHORIZED };
    }

    const currentDateTime = new Date();
    user.lastLogin = currentDateTime;
    user.timesLoggedIn++;
    user.failedLoginAttempt = 0;
    user.lastFailedLoginAttempt = null;
    if (!user.firstLogin) {
      user.firstLogin = currentDateTime;
    }

    const result = await this.repository.update(user.id, user);
    if (!result) {
      return { message: 'Something went pear shaped updating the DB.', status: HttpStatus.INTERNAL_SERVER_ERROR };
    }

    return { token: this.createToken(user), user: this.mapUserToSummary(user) };
  }

  mapUserToSummary(user: User): IUserSummary {
    return {
      name: user.name,
      email: user.email,
      isActive: user.isActive,
      failedLoginAttempt: user.failedLoginAttempt,
      lastFailedLoginAttempt: user.lastFailedLoginAttempt,
      timesLoggedIn: user.timesLoggedIn,
      firstLogin: user.firstLogin,
      lastLogin: user.lastLogin,
      roles: user.roles,
      venues: user.venues?.map((venue) => this.venuesService.mapVenueToIVenueShort(venue)) || []
    };
  }

  private createToken(user: User): string {
    return this.jwtTokenService.sign({
      email: user.email,
      userId: user.id,
      name: user.name,
      roles: user.roles
    });
  }
}
