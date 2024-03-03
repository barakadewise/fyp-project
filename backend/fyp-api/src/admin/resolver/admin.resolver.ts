
import { Admin } from '../entitity/admin.entity';
import { AdminService } from '../service/admin.service';
import { AdminInputDto } from '../dto/admin-input-dto';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class AdminResolver {
    constructor(private readonly adminService: AdminService) { }

    

    //fetch all admin 
    @Query(() => [Admin])
    async findAlladmins(): Promise<Admin[]> {
        return this.adminService.findAll();
    }

    //cretea addmin mutation 
    @Mutation(()=>Admin)
    async createAdmin(@Args('createAdminInput') createAminInput:AdminInputDto ):Promise<Admin>{
        return  await this.adminService.createAdmin(createAminInput)

    }


}
