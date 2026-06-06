import { ObjectType, Field, Int } from '@nestjs/graphql';
import { CommentEntity } from '../../comment/entities/comment.entity';
import { post } from '../../post/entities/post.entity';
import { User } from '../../user/entities/user.entity';
import { Tag } from '../../tag/entities/tag.entity';

@ObjectType()
export class Like {
  @Field(() => Int)
  id!: number;

  @Field(() => [User])
  User!: User[];

  @Field(() => post)
  post!: post;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;

  @Field(() => User)
  author!: User;

  @Field(() => [Tag])
  tags!: Tag[];

  @Field(() => CommentEntity)
  comment!: CommentEntity;
}
