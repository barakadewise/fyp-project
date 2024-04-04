import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class UserDto{
    @Field({nullable:true})
    id:number;

    @Field({nullable:true})
    username:string;
}