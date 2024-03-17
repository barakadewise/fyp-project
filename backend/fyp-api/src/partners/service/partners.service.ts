import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Partner } from '../entity/partner.entity';
import { Repository } from 'typeorm';
import { PartnerDto } from '../dto/partner-input-dto';
import * as bcrypt from 'bcrypt';
import { Role } from 'utils/roles-enums';
import { throwError } from 'rxjs';


@Injectable()
export class PartnersService {
    constructor(@InjectRepository(Partner) private readonly partnerRepository: Repository<Partner>) { }

    //function to create partner
    async createPartner(createPartnerInput: PartnerDto): Promise<Partner> {
        const hashedPassword = await bcrypt.hash(createPartnerInput.password, 10)
        const newPartner = this.partnerRepository.create({
            name: createPartnerInput.name,
            location: createPartnerInput.location,
            phone:createPartnerInput.phone,
            email: createPartnerInput.email,
            address: createPartnerInput.address,
            password:hashedPassword,
            role: Role.partner

        });
        return await this.partnerRepository.save(newPartner);

    }

    async findOne(email:string):Promise<any>{
        try{
            const user =await this.partnerRepository.findOne({where:{email:email}})
            if(!user){
                throw new BadRequestException('User not found')
            }
            return user

        }catch(err){
           throw err
        }
    }
    //Query all partners
    async findAllPartners(): Promise<Partner[]> {
        return await this.partnerRepository.find({ order: { 'createdAt': 'DESC' } })
    }
}
