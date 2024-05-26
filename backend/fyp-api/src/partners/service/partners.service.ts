import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Partner } from '../entity/partner.entity';
import { Repository } from 'typeorm';
import { PartnerDto } from '../dto/partner-input-dto';
import { Account } from 'src/accounts/entities/account.entity';
import { ResponseDto } from 'shared/response-dto';
import { threadId } from 'worker_threads';



@Injectable()
export class PartnersService {
    constructor(@InjectRepository(Partner) private readonly partnerRepository: Repository<Partner>,
        @InjectRepository(Account) private readonly accountRepository: Repository<Account>
    ) { }
    async createPartner(createPartnerInput: PartnerDto, accountId: number) {
        const account = await this.accountRepository.findOne({ where: { id: accountId } })
        if (account) {
            const newPartner = this.partnerRepository.create({ ...createPartnerInput });
            newPartner.accountId = accountId
            console.log("successs", newPartner)
            return await this.partnerRepository.save(newPartner);

        }
        throw new BadRequestException("Invalid user account!")
    }

    async findAllPartners() {
        return await this.partnerRepository.find({ order: { 'createdAt': 'DESC' } })

    }

    async findOneByEmailOrPhone(identifier: string) {
        return await this.partnerRepository.createQueryBuilder('partners').where('partners.email=:identifier OR partners.phone=:identifier', { identifier }).getOne()
    }

    async findById(id: number) {
        const partner = await this.partnerRepository.findOne({ where: { id: id } })
        if (partner) {
            return partner
        }
        throw new NotFoundException('Not found')
    }
    async removePartner(id: number): Promise<ResponseDto> {
        const partner = await this.partnerRepository.findOne({ where: { id: id } })
        if (partner) {
            await this.partnerRepository.delete(id)
            return {
                message: "Successfully deleted",
                statusCode: HttpStatus.OK
            }
        }
        throw new NotFoundException("Partner Not found!")
    }
}
