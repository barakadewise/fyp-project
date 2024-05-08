import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Youth } from '../entity/youth.entity';
import { Repository } from 'typeorm';
import { YouthDto } from '../dto/youth-input-dto';
import * as bcrypt from 'bcrypt'
import { Role } from 'utils/roles-enums';
import { OperationDto } from 'dto/operation-dto';

@Injectable()
export class YouthService {
    constructor(@InjectRepository(Youth) private readonly youthRepository: Repository<Youth>) { }

    //create user  function
    async createYouth(createYouth: YouthDto): Promise<Youth> {
        const hashedPassword = await bcrypt.hash(createYouth.password, 10);
        const newYouth = this.youthRepository.create({...createYouth});
        
        return await this.youthRepository.save(newYouth)
    }

   
    async findOneByEmailOrPhone(identifier: string): Promise<any> {
        return await this.youthRepository.createQueryBuilder('youth').where('youth.email=:identifier OR youth.phone=:identifier', { identifier }).getOne()
    }

    async findAllYouth(): Promise<Youth[]> {
        return this.youthRepository.find({ order: { createdAt: 'DESC' } })
    }

  
    async deleteYouthById(id: number): Promise<OperationDto> {
        const user = await this.youthRepository.findOne({ where: { id: id } })
        if (!user) {
            throw new NotFoundException('User Not found!')
        }
        await this.youthRepository.remove(user)
        return {
            message: 'Successfully deleted',
            statusCode:HttpStatus.OK
        }
    }

}
