import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Logger,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from 'src/shared/interfaces/jwt-payload.interface';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  private logger = new Logger('AuthController', { timestamp: true });

  constructor(private authService: AuthService) {}

  @Post('/signUp')
  signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
    this.logger.verbose(`Sign Up user: ${JSON.stringify(authCredentialsDto)}`);
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/signin')
  signIn(@Body() authCredentialsDto: AuthCredentialsDto): Promise<JwtPayload> {
    this.logger.verbose(`Sign In user: ${JSON.stringify(authCredentialsDto)}`);
    return this.authService.signIn(authCredentialsDto);
  }

  @Get('/list')
  @UseGuards(AuthGuard())
  userList(
    @Query() filterDto: GetUsersFilterDto,
    @GetUser() user: User,
  ): Promise<User[]> {
    this.logger.verbose(`Checking user access: ${JSON.stringify(user)}`);

    if (user.type !== 'admin') {
      this.logger.error(
        `User don't have enough permission to access this service`,
      );
      throw new ForbiddenException(
        `User don't have enough permission to access this service`,
      );
    }

    this.logger.verbose(
      `Retrieving all users. Filters: ${JSON.stringify(filterDto)}`,
    );

    return this.authService.findAll(filterDto);
  }
}
