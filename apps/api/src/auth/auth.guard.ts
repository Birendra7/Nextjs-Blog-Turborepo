import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { verify } from 'jsonwebtoken';

@Injectable()
export class GqlAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    let req: any;

    const maybeGraphqlContext =
      typeof context.getType === 'function' && typeof context.getClass === 'function' && typeof context.getHandler === 'function';

    if (maybeGraphqlContext) {
      const gqlContext = GqlExecutionContext.create(context);
      req = gqlContext.getContext()?.req ?? null;
    }

    if (!req && typeof context.switchToHttp === 'function') {
      req = context.switchToHttp().getRequest();
    }

    const authHeader = req?.headers?.authorization;

    if (!authHeader || typeof authHeader !== 'string') {
      throw new UnauthorizedException('Missing or invalid token');
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('Missing or invalid token');
    }

    try {
      const decoded = verify(token, process.env.JWT_SECRET ?? 'dev-secret') as {
        sub?: number;
        email?: string;
        name?: string;
      };

      req.user = {
        id: decoded.sub ?? null,
        email: decoded.email ?? null,
        name: decoded.name ?? null,
      };

      return true;
    } catch {
      throw new UnauthorizedException('Missing or invalid token');
    }
  }
}
