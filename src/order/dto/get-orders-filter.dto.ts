import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderStatus } from 'src/shared/enums/order-status.enum';

export class GetOrdersFilterDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}
