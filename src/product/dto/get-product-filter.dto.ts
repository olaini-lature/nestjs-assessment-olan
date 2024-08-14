import { IsOptional, IsString } from 'class-validator';

export class GetProductFilterDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
