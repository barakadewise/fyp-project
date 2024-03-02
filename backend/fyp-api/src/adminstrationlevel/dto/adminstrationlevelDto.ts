import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class AdminStrationLevelDto {
    @Field()
    name: string;
}