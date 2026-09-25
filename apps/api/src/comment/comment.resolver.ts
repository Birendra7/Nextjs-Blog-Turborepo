import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { ForbiddenException, UnauthorizedException, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentEntity } from './entities/comment.entity';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { GqlAuthGuard } from '../auth/auth.guard';

@Resolver(() => CommentEntity)
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}

  @Mutation(() => CommentEntity)
  @UseGuards(GqlAuthGuard)
  async createComment(
    @Args('createCommentInput') createCommentInput: CreateCommentInput,
    @Context() context: any,
  ) {
    const user = context.req.user;

    if (!user?.id) {
      throw new UnauthorizedException('User not authenticated');
    }

    const payload = {
      ...createCommentInput,
      authorId: createCommentInput.authorId ?? user.id,
    } as CreateCommentInput & { authorId: number };

    return this.commentService.create(payload);
  }

  @Query(() => [CommentEntity], { name: 'comments' })
  findAll() {
    return this.commentService.findAll();
  }

  @Query(() => CommentEntity, { name: 'comment' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.commentService.findOne(id);
  }

  @Mutation(() => CommentEntity)
  @UseGuards(GqlAuthGuard)
  async updateComment(
    @Args('updateCommentInput') updateCommentInput: UpdateCommentInput,
    @Context() context: any,
  ) {
    const user = context.req.user;
    const existing = await this.commentService.findOne(updateCommentInput.id);

    if (!existing) {
      throw new Error('Comment not found');
    }

    if (existing.authorId !== user.id) {
      throw new ForbiddenException('You can only update your own comments');
    }

    return this.commentService.update(updateCommentInput.id, updateCommentInput);
  }

  @Mutation(() => CommentEntity)
  @UseGuards(GqlAuthGuard)
  async removeComment(@Args('id', { type: () => Int }) id: number, @Context() context: any) {
    const user = context.req.user;
    const existing = await this.commentService.findOne(id);

    if (!existing) {
      throw new Error('Comment not found');
    }

    if (existing.authorId !== user.id) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    return this.commentService.remove(id);
  }
}
