import { IsOptional, IsString } from 'class-validator';

export class GetCartFilterDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  productId: string;
}