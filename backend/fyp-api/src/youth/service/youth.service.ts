import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Youth } from '../entity/youth.entity';
import { DeleteResult, Repository } from 'typeorm';
import { YouthDto } from '../dto/youth-input-dto';
import * as bcrypt from 'bcrypt'
import { Role } from 'utils/roles-enums';
import { OperationDto } from 'dto/operation-dto';

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
            password: hashedPassword,
            role: Role.youth

        });
        return await this.youthRepository.save(newYouth)
    }

    //function to find  youth by email or phone number
    async findOneByEmailOrPhone(identifier: string): Promise<any> {
        // return await this.youthRepository.findOne({ where: { phone: email } })
        return await this.youthRepository.createQueryBuilder('youth').where('youth.email=:identifier OR youth.phone=:identifier', { identifier }).getOne()
    }

    //function to fetch all  youth
    async findAllYouth(): Promise<Youth[]> {
        return this.youthRepository.find({ order: { createdAt: 'DESC' } })
    }

    //delete one user by id 
    async deleteYouthById(id: number): Promise<OperationDto> {
        const user = await this.youthRepository.findOne({ where: { id: id } })
        if (!user) {
            throw new BadRequestException('Invalid operation');
        }
        await this.youthRepository.remove(user)
        return {
            message: 'Successfully deleted'
        }
    }

}
