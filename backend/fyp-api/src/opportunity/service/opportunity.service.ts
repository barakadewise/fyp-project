import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Opportunity } from '../entity/opportunity.entity';
import { Repository } from 'typeorm';
import { OpportunityDto } from '../dto/opportunity-input-dto';

@Injectable()
export class OpportunityService {
    constructor(@InjectRepository(Opportunity) private readonly opportunityRepository: Repository<Opportunity>) { }

    //function to create opportunity
    async createOpportunity(createOpportunityInput: OpportunityDto): Promise<Opportunity> {
        const newOpportunity = this.opportunityRepository.create(createOpportunityInput);
        return await this.opportunityRepository.save(newOpportunity)

    }

    //Query all opportunities
    async findAll(): Promise<Opportunity[]> {
        return await this.opportunityRepository.find({ order: { 'creatdAt': 'DESC' } })
    }
}