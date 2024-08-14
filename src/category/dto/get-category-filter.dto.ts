import { IsOptional, IsString } from 'class-validator';

export class GetCategoryFilterDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
