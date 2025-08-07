import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth.service';
import { ROLES_KEY } from '../decorators/role-defining.decorator';
import { Role } from 'src/profile/enums/role.enum';


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private reflector: Reflector, 
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {

        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY,[
            context.getHandler(),
            context.getClass(),
        ])

      

      const request = context.switchToHttp().getRequest();
      const token = request.cookies?.accessToken;

      if (!token) {
        throw new UnauthorizedException('Not logged IN!!!');
      }

      const payload = await this.authService.decodeAccessToken(token);
    //   console.log(payload)

      // Check if user has any of the required roles
      const hasRequiredRole = requiredRoles.some((role)=>payload.role ===  role);
      if (!hasRequiredRole) {
        throw new UnauthorizedException('Insufficient permissions');
      }
      request.tokenPayload = payload
      return true;
    } catch (error) {
      console.error('Authorization failed:', error.message);
      throw new UnauthorizedException(error.message || 'Access denied');
    }
  }
}