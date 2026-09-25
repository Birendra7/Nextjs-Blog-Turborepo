import { ExecutionContext } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { GqlAuthGuard } from './auth.guard';

describe('GqlAuthGuard', () => {
  it('rejects requests without a bearer token', async () => {
    const guard = new GqlAuthGuard();
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ headers: {} }),
      }),
      getType: () => 'graphql',
      getArgs: () => [],
      getContext: () => ({ req: { headers: {} } }),
    } as unknown as ExecutionContext;

    await expect(guard.canActivate(context)).rejects.toThrow('Missing or invalid token');
  });

  it('accepts requests with a valid bearer token', async () => {
    const guard = new GqlAuthGuard();
    const token = sign({ sub: 42, email: 'demo@example.com', name: 'Demo User' }, 'dev-secret', {
      expiresIn: '7d',
    });

    const req = { headers: { authorization: `Bearer ${token}` } };
    const context = {
      switchToHttp: () => ({
        getRequest: () => req,
      }),
      getType: () => 'graphql',
      getArgs: () => [],
      getContext: () => ({ req }),
    } as unknown as ExecutionContext;

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(req.user).toMatchObject({ id: 42, email: 'demo@example.com' });
  });
});
