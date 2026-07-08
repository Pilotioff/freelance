import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): ReturnType<CanActivate['canActivate']> {
    return super.canActivate(context);
  }

  handleRequest<TUser>(
    err: Error | null,
    user: TUser | false,
  ): TUser {
    if (err || !user) {
      throw err ?? new UnauthorizedException('No autorizado');
    }
    return user;
  }
}

export interface JwtPayload {
  sub: string;
  email: string;
  rol: string;
}

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}
