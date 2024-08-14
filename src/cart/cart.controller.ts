import { Body, Controller, Logger, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard } from '@nestjs/passport';
import { CustomerOnlyAccessInterceptor } from 'src/shared/interceptors/customer-only-access.interceptor';
import { CreateCartDto } from './dto/create-cart.dto';
import { Cart } from './cart.entity';

@Controller('cart')
@UseGuards(AuthGuard())
@UseInterceptors(CustomerOnlyAccessInterceptor)
export class CartController {
  private logger = new Logger('CartController', { timestamp: true });

  constructor(private readonly cartService: CartService) {}

  // @Post()
  // createCart(
  //   @Body() createCartDto: CreateCartDto
  // ): Promise<Cart> {

  // }
}
