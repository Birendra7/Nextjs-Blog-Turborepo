import { ObjectType, Field, Int } from '@nestjs/graphql';
import { post } from '../../post/entities/post.entity';
import { User } from '../../user/entities/user.entity'; 


@ObjectType()
export class CommentEntity {
  @Field(() => Int)
  id!: number;

  @Field()
  content!: string;

  @Field(() => post)
  post!: post;

  @Field(() => User)
  author!: User;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;


}
