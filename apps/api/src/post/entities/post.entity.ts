import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Tag } from '../../tag/entities/tag.entity';

@ObjectType()
export class post {
  @Field(() => Int)
  id!: number;

  @Field()
  title!: string;

  @Field({ nullable: true })
  slug?: string;

  @Field({ nullable: true })
  thumbnail?: string;

  @Field()
  content!: string;

  @Field(() => Boolean)
  published!: boolean;

  @Field(() => [Tag], { nullable: true })
  tags?: Tag[];

  @Field()
  createAt!: Date;

  @Field()
  updateAt!: Date;
}