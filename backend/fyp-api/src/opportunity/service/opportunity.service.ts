import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Opportunity } from '../entity/opportunity.entity';
import { Repository } from 'typeorm';
import { OpportunityDto } from '../dto/opportunity-input-dto';
import { OperationDto } from 'dto/operation-dto';
import { MesssageEnum } from 'shared/message-enum';
import { UpdateOpportunityDto } from '../dto/update-opportunity-dto';
import { ResponseDto } from 'shared/response-dto';

@Injectable()
export class OpportunityService {
  constructor(
    @InjectRepository(Opportunity)
    private readonly opportunityRepository: Repository<Opportunity>,
  ) {}

  async createOpportunity(
    createOpportunityInput: OpportunityDto,
  ): Promise<Opportunity> {
    const newOpportunity = this.opportunityRepository.create({
      ...createOpportunityInput,
    });
    return await this.opportunityRepository.save(newOpportunity);
  }

  async findAllOpportunities(): Promise<Opportunity[]> {
    return await this.opportunityRepository.find({
      order: { creatdAt: 'DESC' },
    });
  }

  async deleteOpportunityById(id: number): Promise<OperationDto> {
    const opportunity = await this.opportunityRepository.findOne({
      where: { id: id },
    });
    if (!opportunity) throw new NotFoundException('Not found');

    await this.opportunityRepository.remove(opportunity);
    return {
      message: MesssageEnum.DELETE,
      statusCode: HttpStatus.OK,
    };
  }

  async updateOpportunity(
    id: number,
    updateOpportunityDto: UpdateOpportunityDto,
  ): Promise<ResponseDto> {
    const opportunity = await this.opportunityRepository.findOne({
      where: { id: id },
    });
    if (!opportunity) throw new NotFoundException('Oppotunity Not Found!');

    //update  opportunity
    await this.opportunityRepository.update(id, { ...updateOpportunityDto });
    return {
      message: MesssageEnum.UPDATE,
      statusCode: HttpStatus.OK,
    };
  }
}
