import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { CategoryService } from 'src/category/category.service';
import { GetProductFilterDto } from './dto/get-product-filter.dto';

@Injectable()
export class ProductService {
  private logger = new Logger('ProductService', { timestamp: true });

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private categoryService: CategoryService,
  ) {}

  async createProduct(createProductDto: CreateProductDto): Promise<void> {
    const { name, price, categoryId } = createProductDto;

    const category = await this.categoryService.findById({ id: categoryId });

    if (category) {
      const productData = {
        name,
        price,
        category
      }
      const product = this.productRepository.create(productData);
  
      try {
        await this.productRepository.save(product);
        this.logger.verbose(
          `Successful create product: ${JSON.stringify(productData)}`,
        );
      } catch (error) {
        if (error.code === '23505') {
          this.logger.error(
            `Duplicate name for product: ${JSON.stringify(createProductDto)}`,
          );
          throw new ConflictException('Name already exists');
        } else {
          this.logger.error(
            `Failed to save product: ${JSON.stringify(createProductDto)}`,
            error.stack,
          );
          throw new InternalServerErrorException(`Failed to save data`);
        }
      }
    } else {
      this.logger.error(
        `No category found with id: ${categoryId}`
      );
      throw new BadRequestException(`No category found with id: ${categoryId}`);
    }
  }

  async findById(filterProductDto: GetProductFilterDto): Promise<Product> {
    const { id } = filterProductDto;

    const query = this.productRepository.createQueryBuilder('product');

    if (id) {
      query.andWhere('product.id = :id', { id });
    } else {
      this.logger.error(
        `Failed to get product. Filters: ${JSON.stringify(filterProductDto)}`
      );
      return null;
    }

    try {
      const product = await query.getOne();
      this.logger.verbose(`Successful get data product: ${JSON.stringify(product)}`);
      return product;
    } catch (error) {
      this.logger.error(
        `Failed to get product. Filters: ${JSON.stringify(filterProductDto)}`,
        error.stack,
      );
      return null;
    }
  }
}
