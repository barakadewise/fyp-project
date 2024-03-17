import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { Admin } from '../entitity/admin.entity';
import { AdminInputDto } from '../dto/admin-input-dto';
import * as bcrypt from 'bcrypt';
import { Role } from 'utils/roles-enums';


@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) { }

  //create admin mutation
  async createAdmin(createAdminInput: AdminInputDto): Promise<Admin> {
    const hashedPassword = await bcrypt.hash(createAdminInput.password, 10)
    const newAdmin = this.adminRepository.create({
      name: createAdminInput.name,
      email: createAdminInput.email,
      phone: createAdminInput.phone,
      is_superAdmin: createAdminInput.is_superAdmin,
      role:Role.admin,
      password:hashedPassword
      
    })
    console.log(newAdmin)
    return await this.adminRepository.save(newAdmin)
  }

  //get all admin list
  async findAll(): Promise<Admin[]> {
    return this.adminRepository.find();
  }
  //find admin by username 
  async findOne(username: string): Promise<any> {
    return await this.adminRepository.findOne({ where: { email: username } })
  }

}