import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateCartDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  productId: string;
}
