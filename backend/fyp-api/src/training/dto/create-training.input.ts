import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';

@InputType()
export class CreateTrainingInput {
  @Field()
  @IsString()
  session: string;

  @Field()
  @IsString()
  duration: string;

  @Field()
  @IsString()
  description: string;

  @Field()
  @IsString()
  startDate: string;

  @Field()
  @IsString()
  endDate: string;

  @Field()
  @IsNumber()
  noOfparticipants: number;
}
