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
    const requiredPermission = this.reflector.getAllAndOverride<string>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const { user } = context.switchToHttp().getRequest();
    
    // Super Admin has all permissions
    if (user && user.role === UserRole.SUPER_ADMIN) {
      return true;
    }

    if (!user) {
      return false;
    }

    const subscription = await this.subscriptionsService.getActiveSubscription({ 
      schoolId: user.schoolId, 
      userId: user.userId || user.id 
    });

    if (!subscription) {
      throw new ForbiddenException('Subscription not found or inactive.');
    }

    if (!requiredPermission) {
      return true;
    }

    const permissions = subscription.modulePermissions;

    // If permissions array is entirely missing (e.g. older legacy plans), we default to allowing access to avoid locking users out.
    // Otherwise, we strictly check for the required permission.
    if (permissions && permissions[requiredPermission] === false) {
      throw new ForbiddenException(`Your subscription plan does not allow access to ${requiredPermission}.`);
    }

    return true;
  }
}

