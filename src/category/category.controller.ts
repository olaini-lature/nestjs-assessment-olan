import { GetUser } from 'src/shared/decorators/get-user.decorator';
import {
  Body,
  Controller,
  ForbiddenException,
  Logger,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.entity';

@Controller('category')
@UseGuards(AuthGuard())
export class CategoryController {
  private logger = new Logger('CategoryController', { timestamp: true });

  constructor(private categoryService: CategoryService) {}

  @Post('/create')
  addCategory(
    @Body() createCategoryDto: CreateCategoryDto,
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

    this.logger.verbose(`Add category: ${JSON.stringify(createCategoryDto)}`);

    return this.categoryService.createCategory(createCategoryDto);
  }
}
