import { Field, ObjectType } from '@nestjs/graphql';
import { Installment } from 'src/installments/entities/installment.entity';

@ObjectType()
export class ProjectData {
  @Field()
  projectName: string;
  @Field()
  ProjectDiscription: string;
  @Field()
  projectDuration: string;
  @Field()
  projectCost: number;
  @Field()
  projectStatus: string;
  @Field()
  projectPartner: string;
  @Field(() => [Installment])
  installments: Installment[];
}
