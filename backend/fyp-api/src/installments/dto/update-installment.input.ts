import { InputType, Field } from '@nestjs/graphql';
import { IsPositive } from 'class-validator';

@InputType()
export class UpdateInstallmentInput {
  @Field({ nullable: true })
  payment_Ref?: string;

  // @Field({ nullable: true })
  // remainAmount: number

  @Field({ nullable: true })
  installment_phase?: number;

  @Field({ nullable: true })
  paid?: number;
}
