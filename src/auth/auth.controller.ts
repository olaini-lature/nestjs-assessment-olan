import { Body, Controller, Get, Logger, Post, Query, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from 'src/shared/interfaces/jwt-payload.interface';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  private logger = new Logger('AuthController');

  constructor(private authService: AuthService) {}

  @Post('/signUp')
  signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/signin')
  signIn(@Body() authCredentialsDto: AuthCredentialsDto): Promise<JwtPayload> {
    return this.authService.signIn(authCredentialsDto);
  }

  @Get('/list')
  @UseGuards(AuthGuard())
  userList(
    @Query() filterDto: GetUsersFilterDto
  ): Promise<User[]> {
    this.logger.verbose(
      `Retrieving all users. Filters: ${JSON.stringify(
        filterDto,
      )}`,
    );

    return this.authService.findAll(filterDto);
  }
}
