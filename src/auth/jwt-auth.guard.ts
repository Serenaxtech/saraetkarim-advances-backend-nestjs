import { Injectable, UnauthorizedException, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    if (context.getType() === 'http') {
      
      const request = context.switchToHttp().getRequest();
      const token = request.cookies['authToken'];
      
      if (!token) {
        throw new UnauthorizedException('No token found');
      }
      
      request.headers.authorization = `Bearer ${token}`;
      return request;
    } else {
      
      const ctx = GqlExecutionContext.create(context);
      const request = ctx.getContext().req;
      const token = request.cookies?.['authToken'];

      if (!token) {
        throw new UnauthorizedException('No token found');
      }

      request.headers.authorization = `Bearer ${token}`;
      return request;
    }
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}