import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PostService } from './post.service';
import { post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Resolver(() => post)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @Query(() => [post])
  posts() {
    return this.postService.findAll();
  }

  @Query(() => post, { nullable: true })
  post(@Args('id', { type: () => Int }) id: number) {
    return this.postService.findOne(id);
  }

  @Mutation(() => post)
  createPost(@Args('createPostDto') createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  @Mutation(() => post)
  updatePost(
    @Args('id', { type: () => Int }) id: number,
    @Args('updatePostDto') updatePostDto: UpdatePostDto,
  ) {
    return this.postService.update(id, updatePostDto);
  }

  @Mutation(() => Boolean)
  removePost(@Args('id', { type: () => Int }) id: number) {
    return this.postService.remove(id);
  }
}
