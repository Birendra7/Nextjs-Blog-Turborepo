import { ObjectType, Field, Int } from '@nestjs/graphql';
import { post } from '../../post/entities/post.entity';


@ObjectType()
export class Tag {
  @Field(() => Int)
  id!: number;

  @Field()
  name!: string;

  @Field(() => [post])
  posts!: post[];

  
}
