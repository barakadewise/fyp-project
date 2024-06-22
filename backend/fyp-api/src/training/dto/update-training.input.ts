import { CreateTrainingInput } from './create-training.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateTrainingInput extends PartialType(CreateTrainingInput) {
  @Field(() => Int)
  id: number;
}
