import { Field, InputType } from '@nestjs/graphql';
import { IsAlpha, IsNumberString, IsString, Length } from 'class-validator';

@InputType()
export class StaffInputDto {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsAlpha()
  gender: string;

  @Field()
  @IsNumberString()
  @Length(10, 10)
  phone: string;

  @Field()
  @IsAlpha()
  status: string;
}
