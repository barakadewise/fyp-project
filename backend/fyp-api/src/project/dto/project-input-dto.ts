import { Field, InputType, ObjectType } from "@nestjs/graphql";


@InputType()
export class ProjectDto{

    @Field()
    name: string;

    @Field()
    cost: number;

    @Field()
    duration: string;

    @Field()
    status: string;

    @Field()
    funded: boolean;

  

}