import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateInstallmentInput {
  @Field()
 total_installments: number


}
