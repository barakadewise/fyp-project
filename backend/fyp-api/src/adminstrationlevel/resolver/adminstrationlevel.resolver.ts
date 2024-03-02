import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AdminstrationlevelService } from '../service/adminstrationlevel.service';
import { AdministrationLevel } from '../entity/adminstration-leve.entity';
import { AdminStrationLevelDto } from '../dto/adminstrationlevelDto';

@Resolver()
export class AdminstrationlevelResolver {
    constructor(private readonly adminiStrationLvelService: AdminstrationlevelService) { }

    @Mutation(() => AdministrationLevel)
    async createAdminLevel(@Args('createLevelInput') createLevelInput: AdminStrationLevelDto): Promise<AdministrationLevel> {
        return await this.adminiStrationLvelService.createAdminStrationLevel(createLevelInput)

    }


}
