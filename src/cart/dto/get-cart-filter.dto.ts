import { IsOptional, IsString } from 'class-validator';

export class GetCartFilterDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  productId?: string;
}