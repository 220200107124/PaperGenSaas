import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SubscriptionsService } from '../../subscriptions/subscriptions.service';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { UserRole } from '../../users/entities/users.entity';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private subscriptionsService: SubscriptionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Bypass subscription check (Development/Request)
    return true;

    /*
    const requiredPermission = this.reflector.getAllAndOverride<string>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermission) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    // Super Admin has all permissions
    if (user.role === UserRole.SUPER_ADMIN) {
      return true;
    }

    if (!user.schoolId) {
      throw new ForbiddenException('User is not associated with any school.');
    }

    const subscription = await this.subscriptionsService.findBySchool(user.schoolId);

    if (!subscription || !subscription.status) {
      throw new ForbiddenException('School does not have an active subscription.');
    }

    const permissions = subscription.modulePermissions || {};

    if (!permissions[requiredPermission]) {
      throw new ForbiddenException('Your subscription plan does not allow this feature.');
    }

    return true;
    */
  }
}
