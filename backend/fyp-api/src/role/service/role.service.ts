import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entity/role-entity';
import { RoleDto } from '../dto/role-input-dto';


export enum Roles{
    admin='Admin',
    youth='Youth',
    partner='Partner',
    team='Team'

}

@Injectable()
export class RoleService {
    constructor(@InjectRepository(Role) private readonly roleRepostory: Repository<Role>) { }

    //function to add or create new role 
    async createRole(createRoleInput: RoleDto): Promise<Role> {
        let role:string=Roles.admin;
        console.log(role)
        const newRole = this.roleRepostory.create(createRoleInput);
        return await this.roleRepostory.save(newRole)
    }

    //query all roles 
    async findAll(): Promise<Role[]> {
        return await this.roleRepostory.find()
    }
}
