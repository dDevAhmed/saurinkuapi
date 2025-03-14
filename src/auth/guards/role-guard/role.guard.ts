import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/common/enums/usersRole.enum';


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get required roles from metadata
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
   

    // Get user from request
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Ensure user is attached to request (e.g., via JWT auth)
    console.log('User from request:', user);

    if (!user || !user.role) {
      throw new ForbiddenException('Access denied: No role assigned');
    }

    // Check if the user has at least one required role
    const hasRequiredRoles = requiredRoles.includes(user.role);
    if (!hasRequiredRoles) {
      throw new ForbiddenException('Access denied: Insufficient role');
    }

    return hasRequiredRoles;
  }
}
