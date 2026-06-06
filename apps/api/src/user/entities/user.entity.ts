import { ObjectType, Field, Int } from '@nestjs/graphql';
import { CommentEntity } from '../../comment/entities/comment.entity';
import { post } from '../../post/entities/post.entity';

@ObjectType()
export class User {
  @Field(() => Int)
  id!: number;

  @Field()
  name!: string;

  @Field()
  email!: string;

  @Field()
  bio?: string;

  @Field()
  avatar?: string;

  @Field(() => [post])
  posts!: post[];

  @Field(() => [CommentEntity])
  comments!: CommentEntity[];
}
