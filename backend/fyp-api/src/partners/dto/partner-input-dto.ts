import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class PartnerDto {
    @Field()
    name: string;

    @Field()
    location: string;

 
    @Field()
    phone: string;
    
    @Field()
    address: string;

    @Field()
    email: string;

    @Field()
    password:string;


}