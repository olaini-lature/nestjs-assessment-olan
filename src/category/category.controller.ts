import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('category')
@UseGuards(AuthGuard())
export class CategoryController {

  private logger = new Logger('CategoryController', { timestamp: true });

  constructor(
    private categoryService: CategoryService
  ) {}

  @Post('/create')
  addCategory(@Body() createCategoryDto: CreateCategoryDto): Promise<void> {
    this.logger.verbose(`Add category: ${JSON.stringify(createCategoryDto)}`);
    return this.categoryService.createCategory(createCategoryDto);
  }

}
