import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { YouthService } from '../service/youth.service';
import { Youth } from '../entity/youth.entity';
import { YouthDto } from '../dto/youth-input-dto';
import { DeleteResult } from 'typeorm';
import { OperationDto } from 'dto/operation-dto';
import { ARRAY_CONTAINS } from 'class-validator';

@Resolver()
export class YouthResolver {
    constructor(private readonly youthServce: YouthService) { }

    @Mutation(_returns => Youth)
    async createYouth(@Args('createYoutDto') createYoutDto: YouthDto,@Args('accountId')accountId:number): Promise<Youth> {
        return await this.youthServce.createYouth(createYoutDto,accountId)
    }

    //resolver to query forall youth
    @Query(_returns => [Youth])
    async findAllYouth(): Promise<Youth[]> {
        return await this.youthServce.findAllYouth()
    }

    @Mutation(() => OperationDto)
    async deleteYouthById(@Args('id') id: number): Promise<OperationDto> {
        return await this.youthServce.deleteYouthById(id)
    }
}
