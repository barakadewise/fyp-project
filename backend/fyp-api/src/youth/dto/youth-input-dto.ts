import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class YouthDto {
    @Field()
    fname: string;

    @Field()
    mname: string;

    @Field()
    lname: string;

    @Field({nullable:true})
    phone: string;

    @Field({nullable:true})
    address?: string;


    @Field()
    education: string;

    @Field()
    skills: string;

    @Field()
    location: string;

    @Field({nullable:true})
    email?: string;

    @Field({nullable:false})
    password:string


}