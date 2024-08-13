import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
  private logger = new Logger('CategoryService', { timestamp: true });

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async createCategory(createCategoryDto: CreateCategoryDto): Promise<void> {
    const { name } = createCategoryDto;

    const category = this.categoryRepository.create({
      name,
    });

    try {
      await this.categoryRepository.save(category);
      this.logger.verbose(
        `Successful create category: ${JSON.stringify(createCategoryDto)}`,
      );
    } catch (error) {
      if (error.code === '23505') {
        this.logger.error(
          `Duplicate name for category: ${JSON.stringify(createCategoryDto)}`,
        );
        throw new ConflictException('Name already exists');
      } else {
        this.logger.error(
          `Failed to save category: ${JSON.stringify(createCategoryDto)}`,
          error.stack,
        );
        throw new InternalServerErrorException();
      }
    }
  }
}
