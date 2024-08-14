import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Cart } from './cart.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCartDto } from './dto/create-cart.dto';
import { Product } from 'src/product/product.entity';
import { ProductService } from 'src/product/product.service';
import { User } from 'src/auth/user.entity';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class CartService {
  private logger = new Logger('CartService', { timestamp: true });

  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    private productService: ProductService,
    private authService: AuthService
  ) {}

  // async createCart(createCartDto: CreateCartDto): Promise<Cart> {
  //   const { amount, productId, userId } = createCartDto;

  //   const product: Product = await this.productService.findById({id: productId});
  //   const user: User = await this.authService.findById({ id: userId });

  //   if (!product) {
  //     this.logger.error(
  //       `No product found with id: ${productId}`
  //     );
  //     throw new BadRequestException(`No product found with id: ${productId}`);
  //   }

  //   if (!user) {
  //     this.logger.error(
  //       `No user found with id: ${userId}`
  //     );
  //     throw new BadRequestException(`No user found with id: ${userId}`);
  //   }
  // }


}
