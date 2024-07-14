import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class TrainingApplicationDto{
    @Field()
    trainingId:number

}