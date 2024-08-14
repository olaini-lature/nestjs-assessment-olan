import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Cart } from './cart.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCartDto } from './dto/create-cart.dto';
import { Product } from 'src/product/product.entity';
import { ProductService } from 'src/product/product.service';
import { User } from 'src/auth/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { GetCartFilterDto } from './dto/get-cart-filter.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { GetCartsFilterDto } from './dto/get-carts-filter.dto';

@Injectable()
export class CartService {
  private logger = new Logger('CartService', { timestamp: true });

  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    private productService: ProductService,
    private authService: AuthService,
  ) {}

  async createCart(createCartDto: CreateCartDto, user: User): Promise<void> {
    const { amount, productId } = createCartDto;

    const product: Product = await this.productService.findById({
      id: productId,
    });

    if (!product) {
      this.logger.error(`No product found with id: ${productId}`);
      throw new BadRequestException(`No product found with id: ${productId}`);
    }

    const existingCart = await this.findCart({ productId }, user);

    if (existingCart) {
      this.logger.error(
        `Failed to save cart. Cart with productId ${productId} exist`,
      );
      throw new BadRequestException(`Cart with productId ${productId} exist`);
    }

    const cartData = {
      amount,
      product,
      user,
    };

    const cart = this.cartRepository.create(cartData);

    try {
      await this.cartRepository.save(cart);
      this.logger.verbose(
        `Successful create cart: ${JSON.stringify(cartData)}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to save cart: ${JSON.stringify(createCartDto)}`,
        error.stack,
      );
      throw new InternalServerErrorException(`Failed to save data`);
    }
  }

  async findCart(filterCartDto: GetCartFilterDto, user: User): Promise<Cart> {
    const { id, productId } = filterCartDto;

    const query = this.cartRepository.createQueryBuilder('cart');

    query.andWhere('cart.userId = :userId', { userId: user.id });

    if (id) {
      query.andWhere('cart.id = :id', { id });
    }

    if (productId) {
      query.andWhere('cart.productId = :productId', { productId });
    }

    try {
      const cart = await query.getOne();
      this.logger.verbose(`Successful get data cart: ${JSON.stringify(cart)}`);
      return cart;
    } catch (error) {
      this.logger.error(
        `Failed to get cart. Filters: ${JSON.stringify(filterCartDto)}`,
        error.stack,
      );
      return null;
    }
  }
  
  async findAll(filterCartsDto: GetCartsFilterDto, user: User): Promise<Cart[]> {
    const { search } = filterCartsDto;

    const query = this.cartRepository.createQueryBuilder('cart');
    query.innerJoinAndSelect('cart.product', 'product');
    query.where({ user });

    if (search) {
      query.andWhere('(LOWER(product.name) LIKE LOWER(:search))', { search: `%${search}%`})
    }

    try {
      const carts = query.getMany();
      this.logger.verbose(`Successful get data carts: ${JSON.stringify(carts)}`);
      return carts;
    } catch (error) {
      this.logger.error(
        `Failed to get cart. Filters: ${JSON.stringify(filterCartsDto)}`,
        error.stack,
      );
      return null;
    }
  }

  async updateCartAmount(
    id: string,
    updateCartDto: UpdateCartDto,
    user: User,
  ): Promise<Cart> {
    const { amount, productId } = updateCartDto;

    const cart: Cart = await this.findCart({ id, productId }, user);

    if (!cart) {
      this.logger.error(`Cart with id ${id} doesn't exist`);
      throw new NotFoundException(`Cart with id ${id} doesn't exist`);
    }

    cart.amount = amount;

    try {
      await this.cartRepository.save(cart);
      this.logger.verbose(`Successful update cart: ${JSON.stringify(cart)}`);
      return cart;
    } catch (error) {
      this.logger.error(
        `Failed to update cart. Data: ${JSON.stringify({
          id,
          productId,
          user,
        })}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }
}
