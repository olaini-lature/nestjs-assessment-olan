import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Cart } from 'src/cart/cart.entity';
import { CartService } from 'src/cart/cart.service';
import { User } from 'src/auth/user.entity';
import { GetOrderFilterDto } from './dto/get-order-filter.dto';
import { GetOrdersFilterDto } from './dto/get-orders-filter.dto';

@Injectable()
export class OrderService {
  private logger = new Logger('OrderService', { timestamp: true });

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @Inject(forwardRef(() => CartService))
    private cartService: CartService,
  ) {}

  async createOrder(
    createOrderDto: CreateOrderDto,
    user: User,
  ): Promise<Order> {
    const { cartIds } = createOrderDto;

    let carts: Cart[] = [];
    let priceTotal: number = 0;

    for (const cartId of cartIds) {
      const cart: Cart = await this.cartService.findCart({ id: cartId }, user);

      if (!cart) {
        this.logger.error(
          `Cart with id ${cartId} not found. Filters: ${JSON.stringify(
            createOrderDto,
          )}`,
        );
        throw new BadRequestException(`Cart with id ${cartId} not found`);
      } else if (cart.order) {
        this.logger.error(
          `Cart with id ${cartId} have ordered with order id ${
            cart.order.id
          }. Filters: ${JSON.stringify(createOrderDto)}`,
        );
        throw new BadRequestException(
          `Cart with id ${cartId} have been ordered with order id ${cart.order.id}`,
        );
      } else {
        priceTotal += cart.amount * cart.product.price;
        carts.push(cart);
      }
    }

    if (!carts) {
      this.logger.error(
        `No cart found placed in order. Filters: ${JSON.stringify(
          createOrderDto,
        )}`,
      );
      throw new BadRequestException(`No cart found placed in order`);
    }

    const dataOrder = this.orderRepository.create({
      price_total: priceTotal,
    });

    try {
      const order = await this.orderRepository.save(dataOrder);

      for (let cart of carts) {
        cart = await this.cartService.updateCartOrder(cart.id, { order }, user);
      }

      return { ...order, carts: carts };
    } catch (error) {
      this.logger.error(
        `Failed to place order: ${JSON.stringify(createOrderDto)}`,
        error.stack,
      );
      throw new InternalServerErrorException(`Failed to create order`);
    }
  }

  async findAll(filterOrdersDto: GetOrdersFilterDto): Promise<Order[]> {
    const { search, status } = filterOrdersDto;

    const query = this.orderRepository.createQueryBuilder('order');
    query.innerJoinAndSelect('order.carts', 'cart');
    query.innerJoinAndSelect('cart.product', 'product');

    if (status) {
      query.andWhere('order.status = :status', { status });
    }

    if (search) {
      query.andWhere('(LOWER(product.name) LIKE LOWER(:search))', {
        search: `%${search}%`,
      });
    }

    try {
      const order = await query.getMany();
      this.logger.log(`Query generated: ${query.getSql()}`);
      this.logger.verbose(
        `Successful get all orders: ${JSON.stringify(order)}`,
      );
      return order;
    } catch (error) {
      this.logger.error(`Failed to get all orders`, error.stack);
      return null;
    }
  }

  async findOrder(filterOrderDto: GetOrderFilterDto): Promise<Order> {
    const { id } = filterOrderDto;

    const query = this.orderRepository.createQueryBuilder('order');

    query.where('order.id = :id', { id });

    try {
      const order = await query.getOne();
      this.logger.verbose(
        `Successful get data order: ${JSON.stringify(order)}`,
      );
      return order;
    } catch (error) {
      this.logger.error(
        `Failed to get order. Filters: ${JSON.stringify(filterOrderDto)}`,
        error.stack,
      );
      return null;
    }
  }
}
