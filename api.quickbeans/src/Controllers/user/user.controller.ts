import { CMessage } from '@base/message.class';
import { INewUser, IOneTimeCodeExpires, IUserJwtPayload, IUserLogin, IUserSummary, IUserToken, IVerifyOneTimeCode } from '@models/user.dto';
import { Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { Body, Get, Headers, HttpCode, Query, UseGuards } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CustomLogger } from '@services/logger.service';
import { CurrentUser } from './current-user.decorator';
import { UserService } from './user.service';

@ApiTags('User')
@Controller({ path: 'user' })
export class AccountController {
  constructor(
    private userService: UserService,
    private logger: CustomLogger
  ) {}

  @Post('login')
  @ApiCreatedResponse({
    description: 'User return'
  })
  async register(@Body() registerUser: INewUser, @Headers() headers: Record<string, string>): Promise<IOneTimeCodeExpires | CMessage> {
    const user: IOneTimeCodeExpires = await this.userService.registerUser(registerUser, headers.origin);

    return user;
  }

  @Get('existing')
  @ApiOkResponse({
    description: 'One time code'
  })
  async getOneTimeCode(@Query('email') email: string): Promise<IVerifyOneTimeCode | CMessage> {
    return await this.userService.loginExistingUser(email);
  }

  @Post('verify-otc')
  @ApiBadRequestResponse()
  @HttpCode(200)
  @ApiOkResponse({
    description: 'A success message if the account exists and one time code matches',
    type: CMessage
  })
  async verifyEmail(@Body() verify: IUserLogin): Promise<CMessage | IUserToken> {
    if (!verify.email || verify.email.length < 4 || !verify.email.includes('@')) {
      throw new HttpException({ status: HttpStatus.BAD_REQUEST, message: 'Email address does not look right' }, HttpStatus.BAD_REQUEST);
    }

    return await this.userService.verifyOneTimeCode(verify);
  }

  // get-account
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @Get('profile')
  async whoAmI(@CurrentUser() user: IUserJwtPayload): Promise<IUserSummary | CMessage> {
    const result = await this.userService.findById(user.id);
    if (!result) {
      return { message: 'You have an existential crisis - your not real', status: HttpStatus.AMBIGUOUS };
    }

    return result;
  }
}
