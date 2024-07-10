import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateInstallmentInputByAdmin{
  @Field()
  total_installments: number
  @Field()
  partnerId:number;

}
