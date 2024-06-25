import { Module } from '@nestjs/common';
import { OpportunityResolver } from './resolver/opportunity.resolver';
import { OpportunityService } from './service/opportunity.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Opportunity } from './entity/opportunity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Opportunity])],
  providers: [OpportunityResolver, OpportunityService],
})
export class OpportunityModule {}
