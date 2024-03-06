import { Field, InputType } from "@nestjs/graphql"


@InputType()
export class AdminInputDto {
    @Field()
    name: string;

    @Field()
    email: string;
    
    
    @Field()
    phone: string;

    @Field()
    password: string;

    @Field()
    is_superAdmin: boolean;

    
}