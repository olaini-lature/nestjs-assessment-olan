import { IsOptional, IsString } from 'class-validator';

export class GetCartsFilterDto {
  @IsOptional()
  @IsString()
  search?: string;
}