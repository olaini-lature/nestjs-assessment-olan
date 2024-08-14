import {
  Body,
  Controller,
  Logger,
  Param,
  Patch,
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
import { UpdateCartDto } from './dto/update-cart.dto';

@Controller('cart')
@UseGuards(AuthGuard())
@UseInterceptors(CustomerOnlyAccessInterceptor)
export class CartController {
  private logger = new Logger('CartController', { timestamp: true });

  constructor(private readonly cartService: CartService) {}

  @Post('/create')
  createCart(
    @Body() createCartDto: CreateCartDto,
    @GetUser() user: User,
  ): Promise<void> {
    this.logger.verbose(`Create cart: ${JSON.stringify(createCartDto)}`);
    return this.cartService.createCart(createCartDto, user);
  }

  @Patch('/:id')
  updateCart(
    @Param('id') id: string,
    @Body() updateCartDto: UpdateCartDto,
    @GetUser() user: User,
  ): Promise<Cart> {
    this.logger.verbose(
      `Update cart with id ${id}: ${JSON.stringify(updateCartDto)}`,
    );
    return this.cartService.updateCartAmount(id, updateCartDto, user);
  }
}
