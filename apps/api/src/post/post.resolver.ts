import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { ForbiddenException, UnauthorizedException, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { GqlAuthGuard } from '../auth/auth.guard';

@Resolver(() => post)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @Query(() => [post])
  posts() {
    return this.postService.findAll();
  }

  @Query(() => post, { nullable: true })
  post(@Args('id', { type: () => Int }) id: number) {
    return this.postService.findOne(id);
  }

  @Mutation(() => post)
  @UseGuards(GqlAuthGuard)
  async createPost(@Args('createPostDto') createPostDto: CreatePostDto, @Context() context: any) {
    const user = context.req.user;

    if (!user?.id) {
      throw new UnauthorizedException('User not authenticated');
    }

    const payload = {
      ...createPostDto,
      authorId: createPostDto.authorId ?? user.id,
    } as CreatePostDto & { authorId: number };

    return this.postService.create(payload);
  }

  @Mutation(() => post)
  @UseGuards(GqlAuthGuard)
  async updatePost(
    @Args('id', { type: () => Int }) id: number,
    @Args('updatePostDto') updatePostDto: UpdatePostDto,
    @Context() context: any,
  ) {
    const user = context.req.user;
    const existing = await this.postService.findOne(id);

    if (!existing) {
      throw new Error('Post not found');
    }

    if (existing.authorId !== user.id) {
      throw new ForbiddenException('You can only update your own posts');
    }

    return this.postService.update(id, {
      ...updatePostDto,
      authorId: user.id,
    });
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async removePost(@Args('id', { type: () => Int }) id: number, @Context() context: any) {
    const user = context.req.user;
    const existing = await this.postService.findOne(id);

    if (!existing) {
      throw new Error('Post not found');
    }

    if (existing.authorId !== user.id) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    return this.postService.remove(id);
  }
}
