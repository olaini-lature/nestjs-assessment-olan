import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateCartAmountDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  productId: string;
}
