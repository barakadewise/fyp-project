import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { YouthService } from '../service/youth.service';
import { Youth } from '../entity/youth.entity';
import { YouthDto } from '../dto/youth-input-dto';

@Resolver()
export class YouthResolver {
    constructor(private readonly youthServce: YouthService) { }

    //create youth mutation
    @Mutation(_returns => Youth)
    async createYouth(@Args('createYoutDto') createYoutDto: YouthDto): Promise<Youth> {
        return await this.youthServce.createYouth(createYoutDto)
    }

    //resolver to query forall youth
    @Query(_returns => [Youth])
    async findAllYouth(): Promise<Youth[]> {
        return await this.youthServce.findAllYouth()
    }
}
