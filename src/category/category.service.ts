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
import { GetCategoryFilterDto } from './dto/get-category-filter.dto';

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

  async findById(filterCategoryDto: GetCategoryFilterDto): Promise<Category> {
    const { id } = filterCategoryDto;
  
    const query = this.categoryRepository.createQueryBuilder('category');

    if (id) {
      query.andWhere('category.id = :id', { id });
    }

    try {
      const category = await query.getOne();
      this.logger.verbose(`Successful get data category: ${JSON.stringify(category)}`);
      return category;
    } catch (error) {
      this.logger.error(
        `Failed to get category. Filters: ${JSON.stringify(filterCategoryDto)}`,
        error.stack,
      );
      return null;
    }
  }

  async findAll(filterCategoryDto: GetCategoryFilterDto): Promise<Category[]> {
    const { id, search } = filterCategoryDto;
  
    const query = this.categoryRepository.createQueryBuilder('category');

    if (id) {
      query.andWhere('category.id = :id', { id });
    }

    if (search) {
      query.andWhere('(LOWER(category.name) LIKE LOWER(:search))', {
        search: `%${search}%`,
      });
    }

    try {
      const categories = await query.getMany();
      this.logger.verbose(`Successful get data category: ${JSON.stringify(categories)}`);
      return categories;
    } catch (error) {
      this.logger.error(
        `Failed to get category. Filters: ${JSON.stringify(filterCategoryDto)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }
}
