import {ObjectType, Field, Int} from '@nestjs/graphql'

@ObjectType()

export class post {
    @Field(()=>Int)

    id: number;

    @Field()
    title: string;

    @Field({nullable:true})
    slug?: string;

    @Field({nullable:true})
    thumbnail?:string;

    @Field()
    content:string;

    @Field(()=>Boolean)
    published: boolean;

    @Field()
    createAt: Date;

    @Field()
    updateAt: Date;

}