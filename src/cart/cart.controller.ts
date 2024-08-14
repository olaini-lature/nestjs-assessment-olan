import {
  Body,
  Controller,
  Logger,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard } from '@nestjs/passport';
import { CustomerOnlyAccessInterceptor } from 'src/shared/interceptors/customer-only-access.interceptor';
import { CreateCartDto } from './dto/create-cart.dto';
import { Cart } from './cart.entity';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('cart')
@UseGuards(AuthGuard())
@UseInterceptors(CustomerOnlyAccessInterceptor)
export class CartController {
  private logger = new Logger('CartController', { timestamp: true });

  constructor(private readonly cartService: CartService) {}

  @Post('/create')
  createCart(
    @Body() createCartDto: CreateCartDto,
    @GetUser() user: User
  ): Promise<void> {
    this.logger.verbose(`Create cart: ${JSON.stringify(createCartDto)}`);
    return this.cartService.createCart(createCartDto, user);
  }
}
