import { InputType, Int, Field } from '@nestjs/graphql';
import { IsAlpha, IsEmail } from 'class-validator';

@InputType()
export class CreateUserInput {
  
  @Field(() => String)
  name!: string;
  
  @Field(() => String)
  password!: string;

  @Field(() => String)
  @IsEmail()
  email!: string;

  @Field(() => String, { nullable: true })
  bio?: string;

  @Field(() => String, { nullable: true })
  avatar?: string;


}
