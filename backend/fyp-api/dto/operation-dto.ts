import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class OperationDto{
    @Field()
    message:string

    @Field()
    statusCode:number;
}