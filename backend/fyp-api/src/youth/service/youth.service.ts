import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Youth } from '../entity/youth.entity';
import { Repository } from 'typeorm';
import { YouthDto } from '../dto/youth-input-dto';
import * as bcrypt from 'bcrypt'

@Injectable()
export class YouthService {
    constructor(@InjectRepository(Youth) private readonly youthRepository: Repository<Youth>) { }

    //async create user 
    async createYouth(createYouth: YouthDto): Promise<Youth> {
        const hashedPassword = await bcrypt.hash(createYouth.password, 10);
        const newYouth = this.youthRepository.create({
            fname: createYouth.fname,
            mname: createYouth.mname,
            lname: createYouth.lname,
            phone: createYouth.phone,
            address: createYouth.address,
            education: createYouth.education,
            skills: createYouth.skills,
            location: createYouth.location,
            email: createYouth.email,
            password:hashedPassword,
            role:createYouth.role
       
        });
        return await this.youthRepository.save(newYouth)
    }


    //function to fetch all  youth
    async findAllYouth(): Promise<Youth[]> {
        return this.youthRepository.find({ order: { createdAt: 'DESC' } })
    }
}
