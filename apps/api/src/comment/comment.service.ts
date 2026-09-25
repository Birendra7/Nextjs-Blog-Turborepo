import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';

type AuthenticatedCreateCommentInput = CreateCommentInput & { authorId: number };

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCommentInput: AuthenticatedCreateCommentInput) {
    return this.prisma.comment.create({
      data: {
        content: createCommentInput.content,
        postId: createCommentInput.postId,
        authorId: createCommentInput.authorId,
      },
      include: {
        post: true,
        author: true,
      },
    });
  }

  findAll() {
    return this.prisma.comment.findMany({
      include: {
        post: true,
        author: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.comment.findUnique({
      where: { id },
      include: {
        post: true,
        author: true,
      },
    });
  }

  update(id: number, updateCommentInput: UpdateCommentInput) {
    return this.prisma.comment.update({
      where: { id },
      data: {
        content: updateCommentInput.content,
      },
      include: {
        post: true,
        author: true,
      },
    });
  }

  remove(id: number) {
    return this.prisma.comment.delete({
      where: { id },
      include: {
        post: true,
        author: true,
      },
    });
  }
}
