import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthUser {
  @Field(() => Int)
  id!: number;

  @Field()
  name!: string;

  @Field()
  email!: string;

  @Field({ nullable: true })
  bio?: string | null;

  @Field({ nullable: true })
  avatar?: string | null;

  @Field()
  token!: string;
}
