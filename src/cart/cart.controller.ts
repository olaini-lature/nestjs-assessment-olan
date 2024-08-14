import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
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
import { GetCartsFilterDto } from './dto/get-carts-filter.dto';

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

  @Get()
  getCarts(
    @Query() filterCartsDto: GetCartsFilterDto,
    @GetUser() user: User,
  ): Promise<Cart[]> {
    this.logger.verbose(
      `User "${user.username}" retrieving all carts. Filters: ${JSON.stringify(
        filterCartsDto,
      )}`,
    );
    return this.cartService.findAll(filterCartsDto, user);
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
