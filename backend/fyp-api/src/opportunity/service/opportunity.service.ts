import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Opportunity } from '../entity/opportunity.entity';
import { Repository } from 'typeorm';
import { OpportunityDto } from '../dto/opportunity-input-dto';
import { OperationDto } from 'dto/operation-dto';

@Injectable()
export class OpportunityService {
    constructor(@InjectRepository(Opportunity) private readonly opportunityRepository: Repository<Opportunity>) { }

    async createOpportunity(createOpportunityInput: OpportunityDto): Promise<Opportunity> {
        const newOpportunity = this.opportunityRepository.create({
            ...createOpportunityInput
        });
        return await this.opportunityRepository.save(newOpportunity)

    }

    async findAllOpportunities(): Promise<Opportunity[]> {
        return await this.opportunityRepository.find({ order: { 'creatdAt': 'DESC' } })
    }

    async deleteOpportunityById(id: number): Promise<OperationDto | any> {
        const opportunity = await this.opportunityRepository.findOne({ where: { id: id } })
        if (!opportunity) {
            throw new NotFoundException('Not found');
        }
        this.opportunityRepository.remove(opportunity)
        return {
            message: "Successfully deleted"
        }
    }
}
