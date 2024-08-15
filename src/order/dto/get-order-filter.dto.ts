import { IsNotEmpty, IsString } from 'class-validator';

export class GetOrderFilterDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}