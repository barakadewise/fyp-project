import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { OpportunityService } from '../service/opportunity.service';
import { OpportunityDto } from '../dto/opportunity-input-dto';
import { Opportunity } from '../entity/opportunity.entity';
import { OperationDto } from 'dto/operation-dto';
import { UpdateOpportunityDto } from '../dto/update-opportunity-dto';
import { ResponseDto } from 'shared/response-dto';

@Resolver()
export class OpportunityResolver {
    constructor(private readonly opprtunityService: OpportunityService) { }


    @Mutation(() => Opportunity)
    async createOpportunity(@Args('createOpportunityInput') createOpportunityInput: OpportunityDto): Promise<Opportunity> {
        return await this.opprtunityService.createOpportunity(createOpportunityInput)

    }

    @Query(_returns => [Opportunity])
    async findAllOpportunities(): Promise<Opportunity[]> {
        return await this.opprtunityService.findAllOpportunities()
    }


    @Mutation(() => OperationDto)
    async deleteOpportunityById(@Args('id') id: number): Promise<OperationDto> {
        return this.opprtunityService.deleteOpportunityById(id)
    }

    @Mutation(() => ResponseDto)
    async updateOpportunity(@Args('opportunityId') opptunityId: number, @Args('updateOpportunityDto') updateOpportunityDto: UpdateOpportunityDto) {
        return await this.opprtunityService.updateOpportunity(opptunityId, updateOpportunityDto)
    }
}
