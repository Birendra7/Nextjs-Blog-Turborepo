import { Injectable, UnauthorizedException } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { UserService } from '../user/user.service';
import { CreateUserInput } from '../user/dto/create-user.input';
import { AuthUser } from './auth.entity';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  private createToken(user: { id: number; email: string; name: string }): string {
    return sign({ sub: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET ?? 'dev-secret', {
      expiresIn: '7d',
    });
  }

  async register(createUserInput: CreateUserInput): Promise<AuthUser> {
    const existingUser = await this.userService.findByEmail(createUserInput.email);

    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    const user = await this.userService.create(createUserInput);
    const { password: _password, ...safeUser } = user;
    const token = this.createToken({
      id: safeUser.id,
      email: safeUser.email,
      name: safeUser.name,
    });

    return { ...safeUser, token } as AuthUser;
  }

  async login(email: string, password: string): Promise<AuthUser> {
    const user = await this.userService.validateCredentials(email, password);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.createToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    return { ...user, token } as AuthUser;
  }
}
