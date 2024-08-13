import { UserType } from '../enums/user-type.enum';

export interface JwtPayload {
  username: string;
  type: UserType;
  accessToken?: string;
}
