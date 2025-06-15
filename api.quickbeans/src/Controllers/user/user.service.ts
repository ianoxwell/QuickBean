import { CMessage } from '@base/message.class';
import { Venue } from '@controllers/venue/Venue.entity';
import { VenueService } from '@controllers/venue/venue.service';
import { ERole } from '@models/base.dto';
import { INewUser, IOneTimeCodeExpires, IUserLogin, IUserProfile, IUserSummary, IUserToken, IVerifyOneTimeCode } from '@models/user.dto';
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

  async findByEmailEntity(email: string): Promise<User | null> {
    const user = await this.repository.findOne({ where: { email, isActive: true } });
    return user || null;
  }

  /** Note this should NOT be used in production - dev purposes only */
  async loginExistingUser(email: string): Promise<IVerifyOneTimeCode | CMessage> {
    this.logger.log(`Logging in existing user with email: ${email}`);
    const existingUser = await this.repository.findOne({ where: { email, isActive: true } });
    if (!existingUser) {
      return new CMessage('No such email address found.', HttpStatus.NOT_FOUND);
    }

    if (existingUser.failedLoginAttempt > 3) {
      existingUser.isActive = false;
      await this.repository.update(existingUser.id, existingUser);
      return new CMessage(
        'Account has been locked out and deactivated - contact your friendly IT support person.',
        HttpStatus.UNAUTHORIZED
      );
    }

    existingUser.oneTimeCode = createDigitPin(6);
    existingUser.oneTimeCodeExpires = getCurrentTimePlusMinutes(10);
    const updatedUser = await this.repository.save(existingUser);
    this.logger.log(`Updated user with new one time code for email: ${email}`);

    return { email: updatedUser.email, oneTimeCode: updatedUser.oneTimeCode, expires: updatedUser.oneTimeCodeExpires };
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
    const users: any[] = await this.repository.query(
      `SELECT u.*, 
        json_agg(distinct v.*) filter (where v.id is not NULL) as venues
        FROM api_quickbeans.public.user u
        LEFT JOIN api_quickbeans.public.user_venues_venue uvv ON uvv."userId" = u.id
        LEFT JOIN api_quickbeans.public.venue v ON v.id = uvv."venueId"
        WHERE u.email = $1
        group by u.id`,
      [basicAuth.email]
    );

    let user: User | null = null;

    if (!!users && users.length > 0) {
      // Map the raw SQL result to a User entity as best as possible
      // This is a simplified mapping; adjust as needed for your schema
      const userRow = users[0] as User & { venues: Venue[] | string };
      user = {
        id: userRow.id,
        name: userRow.name,
        email: userRow.email,
        isActive: userRow.isActive,
        loginProvider: userRow.loginProvider,
        failedLoginAttempt: userRow.failedLoginAttempt || 0,
        lastFailedLoginAttempt: userRow.lastFailedLoginAttempt ? new Date(userRow.lastFailedLoginAttempt) : null,
        timesLoggedIn: userRow.timesLoggedIn || 0,
        firstLogin: userRow.firstLogin ? new Date(userRow.firstLogin) : null,
        lastLogin: userRow.lastLogin ? new Date(userRow.lastLogin) : null,
        oneTimeCode: userRow.oneTimeCode,
        oneTimeCodeExpires: userRow.oneTimeCodeExpires ? new Date(userRow.oneTimeCodeExpires) : null,
        roles: userRow.roles || [],
        venues: (userRow.venues && typeof userRow.venues === 'string' ? JSON.parse(userRow.venues) : userRow.venues) as Venue[]
      };
    }
    if (!user) {
      return { message: 'No such email address found.', status: HttpStatus.NOT_FOUND };
    }

    if (!user.isActive || !['quickbook', 'local'].includes(user.loginProvider.toLowerCase())) {
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
      user.oneTimeCodeExpires.getTime() < new Date().getTime() ||
      user.oneTimeCode !== basicAuth.oneTimeCode
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
    user.oneTimeCode = null;
    user.oneTimeCodeExpires = null;
    if (!user.firstLogin) {
      user.firstLogin = currentDateTime;
    }

    const updatedUser = structuredClone(user); // Clone to avoid mutating the original user object
    // delete property venues to avoid circular reference in JSON
    delete updatedUser.venues;
    const result = await this.repository.update(user.id, updatedUser);
    if (!result) {
      return { message: 'Something went pear shaped updating the DB.', status: HttpStatus.INTERNAL_SERVER_ERROR };
    }

    return { token: this.createToken(user), user: this.mapUserToSummary(user) };
  }

  mapUserToSummary(user: User): IUserSummary {
    return {
      id: user.id,
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
