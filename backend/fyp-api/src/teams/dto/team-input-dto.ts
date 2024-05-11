import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class TeamsDto {
    @Field()
    name: string;

    @Field()
    location: string;

    @Field()
    address: string;

    @Field()
    email: string;

}