import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { ForbiddenException, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { GqlAuthGuard } from '../auth/auth.guard';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.create(createUserInput);
  }

  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.userService.findAll();
  }

  @Query(() => User, { name: 'me', nullable: true })
  @UseGuards(GqlAuthGuard)
  async me(@Context() context: any) {
    const user = context.req.user;

    if (!user?.id) {
      throw new UnauthorizedException('User not authenticated');
    }

    return this.userService.findOne(user.id);
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.userService.findOne(id);
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  async updateUser(@Args('id', { type: () => Int }) id: number, @Args('updateUserInput') updateUserInput: UpdateUserInput, @Context() context: any) {
    const user = context.req.user;

    if (!user?.id) {
      throw new UnauthorizedException('User not authenticated');
    }

    if (id !== user.id) {
      throw new ForbiddenException('You can only update your own profile');
    }

    return this.userService.update(id, { ...updateUserInput, id });
  }

  @Mutation(() => User)
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.userService.remove(id);
  }
}
