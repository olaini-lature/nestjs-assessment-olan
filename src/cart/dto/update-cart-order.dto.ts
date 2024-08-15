import { IsOptional, IsString } from 'class-validator';
import { Order } from 'src/order/order.entity';

export class UpdateCartOrderDto {
  @IsString()
  @IsOptional()
  orderId?: string;

  @IsOptional()
  order?: Order;
}