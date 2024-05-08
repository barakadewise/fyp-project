import { Field, InputType } from "@nestjs/graphql"


@InputType()
export class StaffInputDto {
    @Field()
    name: string;

    @Field()
    gender: string;
    
    @Field()
    phone: string;  
}