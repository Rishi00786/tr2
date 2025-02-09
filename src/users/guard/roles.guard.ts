import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User, Role } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
        context.getHandler(),
        context.getClass(),
      ]);

      const request = context.switchToHttp().getRequest();
      const user = request.user as User | undefined;

      console.log('Admin: ', user);

      if (!user) {
        return false;
      }

      if (user.role == Role.ADMIN) {
        return true;
      }

      return requiredRoles.includes(user.role);
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
