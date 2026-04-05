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

    const hasActive = await this.subscriptionsService.hasActiveSubscription({ 
      schoolId: user.schoolId, 
      userId: user.userId || user.id 
    });

    if (!hasActive) {
      throw new ForbiddenException('You do not have an active subscription.');
    }

    if (!requiredPermission) {
      return true;
    }

    const subscription = user.schoolId 
      ? await this.subscriptionsService.findBySchool(user.schoolId)
      : await this.subscriptionsService.findByUser(user.userId || user.id);

    if (!subscription) {
      throw new ForbiddenException('Subscription not found.');
    }

    const permissions = subscription.modulePermissions || {};

    if (!permissions[requiredPermission]) {
      throw new ForbiddenException(`Your subscription plan does not allow access to ${requiredPermission}.`);
    }

    return true;
  }
}

