import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRole } from '../../users/entities/users.entity';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    // SUPER_ADMIN has full access
    if (user.role === UserRole.SUPER_ADMIN) {
      return true;
    }

    /* 
    // SCHOOL_ADMIN must have a schoolId
    if (user.role === UserRole.SCHOOL_ADMIN && !user.schoolId) {
      throw new ForbiddenException('User is not assigned to any school');
    }
    */

    return true;
  }
}
