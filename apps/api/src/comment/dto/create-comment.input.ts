import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateCommentInput {
  @Field()
  content: string;

  @Field(() => Int)
  postId: number;

  @Field(() => Int, { nullable: true })
  authorId?: number;
}
