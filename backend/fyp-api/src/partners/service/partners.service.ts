import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Partner } from '../entity/partner.entity';
import { Repository } from 'typeorm';
import { PartnerDto } from '../dto/partner-input-dto';
import * as bcrypt from 'bcrypt';


@Injectable()
export class PartnersService {
    constructor(@InjectRepository(Partner) private readonly partnerRepository: Repository<Partner>) { }

    //function to create partner
    async createPartner(createPartnerInput: PartnerDto): Promise<Partner> {
        const hashedPassword = await bcrypt.hash(createPartnerInput.password, 10)
        const newPartner = this.partnerRepository.create({
            name: createPartnerInput.name,
            location: createPartnerInput.location,
            email: createPartnerInput.email,
            address: createPartnerInput.address,
            password: hashedPassword,
        });
        return await this.partnerRepository.save(newPartner);

    }

    //Query all partners
    async findAllPartners(): Promise<Partner[]> {
        return await this.partnerRepository.find({ order: { 'createdAt': 'DESC' } })
    }
}
