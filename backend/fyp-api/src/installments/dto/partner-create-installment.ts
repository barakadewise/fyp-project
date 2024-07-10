import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateInstallmentInputByPartner {
@Field()
  total_installments: number;

}
