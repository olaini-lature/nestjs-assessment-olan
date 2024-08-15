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
import { OrderService } from './order.service';
import { AuthGuard } from '@nestjs/passport';
import { Order } from './order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CustomerOnlyAccessInterceptor } from 'src/shared/interceptors/customer-only-access.interceptor';
import { AdminOnlyAccessInterceptor } from 'src/shared/interceptors/admin-only-access.interceptor';
import { GetOrdersFilterDto } from './dto/get-orders-filter.dto';

@Controller('order')
@UseGuards(AuthGuard())
export class OrderController {
  private logger = new Logger('OrderController', { timestamp: true });

  constructor(private readonly orderService: OrderService) {}

  @Post('/create')
  @UseInterceptors(CustomerOnlyAccessInterceptor)
  createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @GetUser() user: User,
  ): Promise<Order> {
    this.logger.verbose(
      `User ${user.username} creating a new order. Data: ${JSON.stringify(
        createOrderDto,
      )}`,
    );
    return this.orderService.createOrder(createOrderDto, user);
  }

  @Get()
  @UseInterceptors(AdminOnlyAccessInterceptor)
  getOrders(
    @Query() filterOrdersDto: GetOrdersFilterDto,
    @GetUser() user: User,
  ): Promise<Order[]> {
    this.logger.verbose(
      `User ${user.username} retrieving all orders. Data: ${JSON.stringify(
        filterOrdersDto,
      )}`,
    );
    return this.orderService.findAll(filterOrdersDto);
  }
}
