import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class RoleDto {
    @Field()
    name: string;

}