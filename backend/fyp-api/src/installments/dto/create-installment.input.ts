import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateInstallmentInput {
  @Field({nullable:true})
 

  @Field()
  total_installments: number

  @Field({nullable:true})
  partnerId:number
}
