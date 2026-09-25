import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTagInput } from './dto/create-tag.input';
import { UpdateTagInput } from './dto/update-tag.input';

@Injectable()
export class TagService {
  constructor(private readonly prisma: PrismaService) {}

  create(createTagInput: CreateTagInput) {
    return this.prisma.tag.create({
      data: {
        name: createTagInput.name,
      },
      include: {
        posts: true,
      },
    });
  }

  findAll() {
    return this.prisma.tag.findMany({
      include: {
        posts: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.tag.findUnique({
      where: { id },
      include: {
        posts: true,
      },
    });
  }

  update(id: number, updateTagInput: UpdateTagInput) {
    return this.prisma.tag.update({
      where: { id },
      data: {
        name: updateTagInput.name,
      },
      include: {
        posts: true,
      },
    });
  }

  remove(id: number) {
    return this.prisma.tag.delete({
      where: { id },
      include: {
        posts: true,
      },
    });
  }
}
