import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('product')
@UseGuards(AuthGuard())
export class ProductController {

  private logger = new Logger('ProductController', { timestamp: true });

  constructor(
    private productService: ProductService
  ) {}

  @Post('/create')
  addCategory(@Body() createProductDto: CreateProductDto): Promise<void> {
    this.logger.verbose(`Add product: ${JSON.stringify(createProductDto)}`);
    return this.productService.createProduct(createProductDto);
  }
}
