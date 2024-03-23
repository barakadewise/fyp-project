import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class OpportunityDto{
    @Field()
    name:string;

    @Field()
    location:string;
    
    @Field()
    duration:string;
    

}