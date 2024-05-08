import { Injectable } from '@nestjs/common';
import { Staff } from '../entity/staff-entity';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { Role } from 'utils/roles-enums';
import * as bcrypt from 'bcrypt';
import { StaffInputDto } from '../dto/ceate-straff-input';

@Injectable()
export class StaffService {
    constructor(
        @InjectRepository(Staff)
        private readonly staffRepository: Repository<Staff>,
      ) { }
    
    
      async createStaff(createStaffInput: StaffInputDto): Promise<Staff> {
        const newstaff = this.staffRepository.create({...createStaffInput})
        return await this.staffRepository.save(newstaff)
      }
    
  
      async findAll(): Promise<Staff[]> {
        return this.staffRepository.find();
      }
   
      async findOne(username: string): Promise<any> {
        return await this.staffRepository.findOne({ where: { email: username } })
      }

}
