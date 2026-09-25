import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserInput } from '../user/dto/create-user.input';
import { AuthUser } from './auth.entity';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async register(createUserInput: CreateUserInput): Promise<AuthUser> {
    const existingUser = await this.userService.findByEmail(createUserInput.email);

    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    const user = await this.userService.create(createUserInput);
    const { password: _password, ...safeUser } = user;
    return safeUser as AuthUser;
  }

  async login(email: string, password: string): Promise<AuthUser> {
    const user = await this.userService.validateCredentials(email, password);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return user as AuthUser;
  }
}
