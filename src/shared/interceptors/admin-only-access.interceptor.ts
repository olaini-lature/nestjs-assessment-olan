import {
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { UserType } from '../enums/user-type.enum';

@Injectable()
export class AdminOnlyAccessInterceptor implements NestInterceptor {
  private logger = new Logger('AdminOnlyAccessInterceptor', {
    timestamp: true,
  });

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const req = context.switchToHttp().getRequest();

    if (req && req.user && req.user.type === UserType.ADMIN) {
      return next.handle();
    } else {
      this.logger.error(
        `User don't have enough permission to access this service`,
      );
      throw new ForbiddenException(
        `User don't have enough permission to access this service`,
      );
    }
  }
}
