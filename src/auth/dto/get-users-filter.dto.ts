import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserType } from 'src/shared/enums/user-type.enum';

export class GetUsersFilterDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(UserType)
  type?: UserType;
}