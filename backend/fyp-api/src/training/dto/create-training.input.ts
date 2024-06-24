import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateTrainingInput {
  @Field()
  session: string

  @Field()
  duration: string

  @Field()
  description: string

  @Field()
  startDate:string

  @Field()
  endDate:string

  @Field()
  noOfparticipants: number
}
