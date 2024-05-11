import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { StaffService } from '../service/staff.service';
import { Staff } from '../entity/staff-entity';
import { StaffInputDto } from '../dto/ceate-straff-input';


@Resolver()
export class StaffResolver {
  constructor(private readonly staffService: StaffService) { }
  @Mutation(_retruns => Staff)
  async createStaff(@Args('createStaffInput') createStaffInput: StaffInputDto, @Args('accountId') accountId: number) {
    return await this.staffService.createStaff(createStaffInput, accountId)

  }
@Query(()=>[Staff])
async findAllStaffs(){
  return await this.staffService.findAll()
}
}
