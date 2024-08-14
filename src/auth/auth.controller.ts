import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from 'src/shared/interfaces/jwt-payload.interface';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';
import { AdminOnlyAccessInterceptor } from 'src/shared/interceptors/admin-only-access.interceptor';

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
  @UseInterceptors(AdminOnlyAccessInterceptor)
  userList(@Query() filterDto: GetUsersFilterDto): Promise<User[]> {
    this.logger.verbose(
      `Retrieving all users. Filters: ${JSON.stringify(filterDto)}`,
    );

    return this.authService.findAll(filterDto);
  }
}
