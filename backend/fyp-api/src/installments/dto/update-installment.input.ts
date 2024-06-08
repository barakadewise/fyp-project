import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateInstallmentInput {
  @Field()
  installmentId?: number

  @Field({ nullable: true })
  payment_Ref?: string

  @Field({ nullable: true })
  installment_phase?: number

  @Field({ nullable: true })
  paid?: number
}
