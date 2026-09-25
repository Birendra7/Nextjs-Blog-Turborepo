import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from '../prisma/prisma.service';

type AuthenticatedCreatePostDto = CreatePostDto & { authorId: number };

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.post.findMany({
      include: {
        tags: true,
      },
    });
  }

  async findOne(id: number) {
    return await this.prisma.post.findUnique({
      where: { id },
      include: {
        tags: true,
      },
    });
  }

  async create(createPostDto: AuthenticatedCreatePostDto) {
    return await this.prisma.post.create({
      data: {
        ...createPostDto,
        authorId: createPostDto.authorId,
      },
    });
  }

  async update(id: number, updatePostDto: UpdatePostDto & { authorId?: number }) {
    return await this.prisma.post.update({
      where: { id },
      data: updatePostDto,
    });
  }

  async remove(id: number) {
    await this.prisma.post.delete({
      where: { id },
    });
    return true;
  }
}
