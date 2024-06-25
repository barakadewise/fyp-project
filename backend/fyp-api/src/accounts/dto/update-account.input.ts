import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateAccountInput {
  @Field()
  email: string;

  @Field()
  password: string;
}
