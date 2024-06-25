import { InputType, PartialType } from '@nestjs/graphql';
import { OpportunityDto } from './opportunity-input-dto';

@InputType()
export class UpdateOpportunityDto extends PartialType(OpportunityDto) {}
