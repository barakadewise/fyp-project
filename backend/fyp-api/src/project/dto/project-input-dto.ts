import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ProjectDto {
  @Field()
  name: string;

  @Field()
  cost: number;

  @Field()
  duration: string;

  @Field()
  discription: string;

  @Field()
  status: string;

  @Field()
  funded: boolean;
}
