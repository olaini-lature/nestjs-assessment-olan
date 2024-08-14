import {
  Body,
  Controller,
  ForbiddenException,
  Logger,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('product')
@UseGuards(AuthGuard())
export class ProductController {
  private logger = new Logger('ProductController', { timestamp: true });

  constructor(private productService: ProductService) {}

  @Post('/create')
  addCategory(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: User,
  ): Promise<void> {
    this.logger.verbose(`Checking user access: ${JSON.stringify(user)}`);

    if (user.type !== 'admin') {
      this.logger.error(
        `User don't have enough permission to access this service`,
      );
      throw new ForbiddenException(
        `User don't have enough permission to access this service`,
      );
    }

    this.logger.verbose(`Add product: ${JSON.stringify(createProductDto)}`);
    return this.productService.createProduct(createProductDto);
  }
}
