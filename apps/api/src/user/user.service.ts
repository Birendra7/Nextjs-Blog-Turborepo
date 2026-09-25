import { Injectable } from '@nestjs/common';
import { hash, verify } from 'argon2';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserInput: CreateUserInput) {
    const { password, ...user } = createUserInput;
    const hashedPassword = await hash(password);

    return await this.prisma.user.create({
      data: {
        ...user,
        password: hashedPassword,
      },
    });
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async validateCredentials(email: string, password: string) {
    const user = await this.findByEmail(email);

    if (!user || !user.password) {
      return null;
    }

    const isValid = await verify(user.password, password);
    if (!isValid) {
      return null;
    }

    const { password: _password, ...safeUser } = user;
    return safeUser;
  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateUserInput: UpdateUserInput) {
    return await this.prisma.user.update({
      where: { id },
      data: updateUserInput,
    });
  }

  async remove(id: number) {
    return await this.prisma.user.delete({
      where: { id },
    });
  }
}
