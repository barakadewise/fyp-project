import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Role } from '../entity/role-entity';
import { RoleService } from '../service/role.service';
import { RoleDto } from '../dto/role-input-dto';

@Resolver()
export class RoleResolver {
    constructor(private readonly roleService: RoleService) { }

    //create opportunity mutation 
    @Mutation(() => Role)
    async createRole(@Args('createRoleInput') createRoleInput: RoleDto): Promise<Role> {
        return await this.roleService.createRole(createRoleInput)

    }

    //Query all opportunities
    @Query(() => [Role])
    async findAllroles(): Promise<Role[]> {
        return await this.roleService.findAll()
    }

}
