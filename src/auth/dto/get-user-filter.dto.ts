import { IsOptional, IsString } from 'class-validator';

export class GetUserFilterDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  search?: string;
}