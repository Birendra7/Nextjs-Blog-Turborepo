import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreatePostDto {
  @Field()
  title: string;

  @Field()
  content: string;

  @Field({ nullable: true })
  slug?: string;

  @Field({ nullable: true })
  thumbnail?: string;

  @Field(() => Boolean)
  published: boolean;

  @Field(() => Int)
  authorId: number;
}
