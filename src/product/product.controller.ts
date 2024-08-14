import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('product')
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
