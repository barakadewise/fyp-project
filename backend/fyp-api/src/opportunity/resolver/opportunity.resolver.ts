import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { OpportunityService } from '../service/opportunity.service';
import { OpportunityDto } from '../dto/opportunity-input-dto';
import { Opportunity } from '../entity/opportunity.entity';

@Resolver()
export class OpportunityResolver {
    constructor(private readonly opprtunityService: OpportunityService) { }

    //create opportunity mutation 
    @Mutation(() => Opportunity)
    async createOpportunity(@Args('createOpportunityInput') createOpportunityInput: OpportunityDto): Promise<Opportunity> {
        return await this.opprtunityService.createOpportunity(createOpportunityInput)

    }

    //Query all opportunities
    @Query(_returns => [Opportunity])
    async findAllOpportunities(): Promise<Opportunity[]> {
        return await this.opprtunityService.findAll()
    }

}
