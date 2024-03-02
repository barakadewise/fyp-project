import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { PartnersService } from '../service/partners.service';
import { PartnerDto } from '../dto/partner-input-dto';
import { Partner } from '../entity/partner.entity';

@Resolver()
export class PartnersResolver {
    constructor(private readonly partnerService:PartnersService){}

    //mutation to create partner
    @Mutation(_retruns =>Partner)
    async createPartner(@Args('createPartnerInput') createPartnerInput: PartnerDto): Promise<Partner> {
        return await this.partnerService.createPartner(createPartnerInput)

    }

}
