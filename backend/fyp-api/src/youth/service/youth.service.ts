import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Youth } from '../entity/youth.entity';
import { Repository } from 'typeorm';
import { YouthDto } from '../dto/youth-input-dto';
import { OperationDto } from 'dto/operation-dto';
import { Account } from 'src/accounts/entities/account.entity';
import { UpdateYouthDto } from '../dto/update-youth-dto';
import { ResponseDto } from 'shared/response-dto';

@Injectable()
export class YouthService {
    constructor(@InjectRepository(Youth) private readonly youthRepository: Repository<Youth>,
        @InjectRepository(Account) private readonly accountRepository: Repository<Account>) { }


    async createYouth(createYouth: YouthDto, accountId: number): Promise<Youth> {
        const account = await this.accountRepository.findOne({ where: { id: accountId } })
        if (account) {
            const newYouth = this.youthRepository.create({ ...createYouth });
            newYouth.accountId = accountId
            newYouth.email=account.email
            return await this.youthRepository.save(newYouth)

        }
        throw new BadRequestException('Invalid user account')

    }

    async findOneByEmailOrPhone(identifier: string): Promise<any> {
        return await this.youthRepository.createQueryBuilder('youth').where('youth.email=:identifier OR youth.phone=:identifier', { identifier }).getOne()
    }

    async findAllYouth(): Promise<Youth[]> {
        return this.youthRepository.find({ order: { createdAt: 'DESC' } })
    }

    async deleteYouthById(id: number): Promise<OperationDto> {
        const user = await this.youthRepository.findOne({ where: { id: id } })
        if (user) {
            await this.youthRepository.remove(user)
            return {
                message: 'Successfully deleted',
                statusCode: HttpStatus.OK
            }

        }
        throw new NotFoundException('User Not found!')

    }

    async updateYouth(updateYouthDto: UpdateYouthDto, youthId: number): Promise<ResponseDto> {
        const youth = await this.youthRepository.findOne({ where: { id: youthId } })
        if (youth) {
            await this.youthRepository.update(youthId, {...updateYouthDto})
            console.log(await this.youthRepository.findOne({where:{lname:"youth"}}))
            return {
                message: "Successfully Updated",
                statusCode: HttpStatus.OK
            }
        }
        throw new BadRequestException("Failed to update corresponding user Not Found")
    }
}
