
import { Admin } from '../entitity/admin.entity';
import { AdminService } from '../service/admin.service';
import { AdminInputDto } from '../dto/admin-input-dto';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guard/gql-auth.guard';
import { UserDto } from 'dto/user.dto';


@Resolver()
export class AdminResolver {
    constructor(private readonly adminService: AdminService) { }
    
    // @UseGuards(GqlAuthGuard)
    @Query(() => [Admin])
    async findAlladmins(): Promise<Admin[]> {
        return this.adminService.findAll();
    }

    //cretea addmin mutation 
    @Mutation(() => Admin)
    async createAdmin(@Args('createAdminInput') createAminInput: AdminInputDto): Promise<Admin> {
        return await this.adminService.createAdmin(createAminInput)

    }

    // get current signed user 
    @UseGuards(GqlAuthGuard)
    @Query(returns => UserDto)
    async getCurrentUser(@Context() context): Promise<UserDto> {
        console.log(context.req.user)
        const currentUser = context.req.user;
        // console.log(context.req.user.username);
        return {
            id: currentUser.sub,
            username: currentUser.username,
            
        }
    }

}




