import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PartnersService } from '../service/partners.service';
import { PartnerDto } from '../dto/partner-input-dto';
import { Partner } from '../entity/partner.entity';
import { ResponseDto } from 'shared/response-dto';

@Resolver()
export class PartnersResolver {
    constructor(private readonly partnerService: PartnersService) { }
    @Mutation(_retruns => Partner)
    async createPartner(@Args('createPartnerInput') createPartnerInput: PartnerDto, @Args('accountId') accountId: number) {
        return await this.partnerService.createPartner(createPartnerInput, accountId)

    }
    @Query(_returns => [Partner])
    async findAllPartners() {
        return await this.partnerService.findAllPartners()
    }
    @Mutation(_retruns => ResponseDto)
    async removePartner(@Args('id') id: number) {
        return await this.partnerService.removePartner(id)
    }
}
