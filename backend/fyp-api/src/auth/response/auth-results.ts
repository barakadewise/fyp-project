import { Field, ObjectType } from "@nestjs/graphql";



@ObjectType()
export class AuthResults {
    @Field({ nullable: true })
    message: string;

    @Field({nullable:true})
    id:number;

    @Field({nullable:true})
    user:string;

    @Field({nullable:true})
    access_token: string;

    


}