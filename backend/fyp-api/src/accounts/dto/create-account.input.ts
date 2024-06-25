import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, Length, max, min } from 'class-validator';

@InputType()
export class CreateAccountInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @Length(5, 15, { message: 'Password should be atleast 5 characters' })
  password: string;

  @Field()
  @IsString()
  role: string;
}
