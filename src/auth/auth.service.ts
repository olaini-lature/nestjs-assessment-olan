import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from 'src/shared/interfaces/jwt-payload.interface';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import { GetUserFilterDto } from './dto/get-user-filter.dto';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService', { timestamp: true });

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password, type } = authCredentialsDto;

    // hashing
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.userRepository.create({
      username,
      password: hashedPassword,
      type,
    });

    try {
      await this.userRepository.save(user);
      this.logger.verbose(
        `Successful save user: ${JSON.stringify(authCredentialsDto)}`,
      );
    } catch (error) {
      if (error.code === '23505') {
        this.logger.error(
          `Duplicate username for user: ${JSON.stringify(authCredentialsDto)}`,
        );
        throw new ConflictException('Username already exists');
      } else {
        this.logger.error(
          `Failed to save user: ${JSON.stringify(authCredentialsDto)}`,
          error.stack,
        );
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<JwtPayload> {
    const { username, password, type } = authCredentialsDto;

    const user = await this.userRepository.findOne({
      where: {
        username,
        type,
      },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username, type };
      const accessToken: string = await this.jwtService.sign(payload);
      const data: JwtPayload = {
        username,
        type,
        accessToken,
      };

      this.logger.verbose(`Successful sign in user: ${JSON.stringify(data)}`);

      return data;
    } else {
      this.logger.error(
        `Failed credential for user: ${JSON.stringify(authCredentialsDto)}`,
      );
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  async findById(filterUserDto: GetUserFilterDto): Promise<User> {
    const { id } = filterUserDto;

    const query = this.userRepository.createQueryBuilder('user');

    if (id) {
      query.andWhere('user.id = :id', { id });
    } else {
      this.logger.error(
        `Failed to get user. Filters: ${JSON.stringify(filterUserDto)}`
      );
      return null;
    }

    try {
      const user = await query.getOne();
      this.logger.verbose(`Successful get data user: ${JSON.stringify(user)}`);
      return user;
    } catch (error) {
      this.logger.error(
        `Failed to get user. Filters: ${JSON.stringify(filterUserDto)}`,
        error.stack,
      );
      return null;
    }
  }

  async findAll(filterDto: GetUsersFilterDto): Promise<User[]> {
    const { search, type } = filterDto;

    const query = this.userRepository.createQueryBuilder('user');

    if (type) {
      query.andWhere('user.type = :type', { type });
    }

    if (search) {
      query.andWhere('(LOWER(user.username) LIKE LOWER(:search))', {
        search: `%${search}%`,
      });
    }

    try {
      const users = await query.getMany();
      this.logger.verbose(`Successful get data user: ${JSON.stringify(users)}`);
      return users;
    } catch (error) {
      this.logger.error(
        `Failed to get users. Filters: ${JSON.stringify(filterDto)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }
}
