import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Partner } from '../entity/partner.entity';
import { Repository } from 'typeorm';
import { PartnerDto } from '../dto/partner-input-dto';
import * as bcrypt from 'bcrypt';
import { Role } from 'utils/roles-enums';


@Injectable()
export class PartnersService {
    constructor(@InjectRepository(Partner) private readonly partnerRepository: Repository<Partner>) { }

    //function to create partner
    async createPartner(createPartnerInput: PartnerDto): Promise<Partner> {
        const hashedPassword = await bcrypt.hash(createPartnerInput.password, 10)
        const newPartner = this.partnerRepository.create({...createPartnerInput});
        return await this.partnerRepository.save(newPartner);

    }

    //function to find partner by email
    // async findOne(email: string): Promise<any> {
    //     return await this.partnerRepository.findOne({ where: { email: e } })
    // }

    //Query all partners
    async findAllPartners(): Promise<Partner[]> {
        return await this.partnerRepository.find({ order: { 'createdAt': 'DESC' } })

    }

    //function to find the partner by email or phone
    async findOneByEmailOrPhone(identifier: string): Promise<any> {
        return await this.partnerRepository.createQueryBuilder('partners').where('partners.email=:identifier OR partners.phone=:identifier', { identifier }).getOne()
    }



    //function to find the partner by ID
    async findById(id: number): Promise<Partner> {
        return await this.partnerRepository.findOne({ where: { id: id } })
    }
}
