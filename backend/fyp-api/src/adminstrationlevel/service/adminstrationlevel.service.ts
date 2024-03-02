import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdministrationLevel } from '../entity/adminstration-leve.entity';
import { Repository } from 'typeorm';
import { AdminStrationLevelDto } from '../dto/adminstrationlevelDto';

@Injectable()
export class AdminstrationlevelService {
    constructor(@InjectRepository(AdministrationLevel)private readonly adminstrationLevelRepository:Repository<AdministrationLevel>){}

    //create administration level 
    async createAdminStrationLevel(AdminlevelInput: AdminStrationLevelDto ):Promise<AdministrationLevel>{
        const newAdministration=await this.adminstrationLevelRepository.create(AdminlevelInput)
        return await this.adminstrationLevelRepository.save(newAdministration)
        
    }
}
