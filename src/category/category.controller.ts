import {
  Body,
  Controller,
  Logger,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { AuthGuard } from '@nestjs/passport';
import { AdminOnlyAccessInterceptor } from 'src/shared/interceptors/admin-only-access.interceptor';

@Controller('category')
@UseGuards(AuthGuard())
@UseInterceptors(AdminOnlyAccessInterceptor)
export class CategoryController {
  private logger = new Logger('CategoryController', { timestamp: true });

  constructor(private categoryService: CategoryService) {}

  @Post('/create')
  addCategory(@Body() createCategoryDto: CreateCategoryDto): Promise<void> {
    this.logger.verbose(`Add category: ${JSON.stringify(createCategoryDto)}`);
    return this.categoryService.createCategory(createCategoryDto);
  }
}
