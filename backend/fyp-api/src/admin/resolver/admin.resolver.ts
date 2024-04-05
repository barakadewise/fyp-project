
import { Admin } from '../entitity/admin.entity';
import { AdminService } from '../service/admin.service';
import { AdminInputDto } from '../dto/admin-input-dto';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guard/gql-auth.guard';
import { User as CurrentUser } from 'decorator/user.decorator'

import { UserDto } from 'dto/user.dto';
import { Console } from 'console';

@Resolver()
export class AdminResolver {
    constructor(private readonly adminService: AdminService) { }



    //fetch all admin 
    @UseGuards(GqlAuthGuard)
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
        // console.log("sucessfully retrieved data from the payload");
        return {
            id: currentUser.sub,
            username: currentUser.username,
            
        }
    }

}




