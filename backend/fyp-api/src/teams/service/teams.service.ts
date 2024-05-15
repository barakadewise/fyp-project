import { BadRequestException, Injectable } from '@nestjs/common';
import { Teams } from '../entity/team.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TeamsDto } from '../dto/team-input-dto';
import * as bcript from 'bcrypt'
import { Account } from 'src/accounts/entities/account.entity';

@Injectable()
export class TeamsService {
    constructor(
        @InjectRepository(Teams) private readonly teamsRepository: Repository<Teams>,
        @InjectRepository(Account) private readonly accountRepository: Repository<Account>
    ) { }

    async createTeam(createTeamInput: TeamsDto, accountId: number) {
        const account = await this.accountRepository.findOne({ where: { id: accountId } })
        if (account) {
            const newTeam = this.teamsRepository.create({ ...createTeamInput })
            newTeam.accountId = accountId,
            newTeam.email = account.email
            return await this.teamsRepository.save(newTeam);

        }
        throw new BadRequestException("Invalid user account")

    }

    async findAllTeams(): Promise<Teams[]> {
        return await this.teamsRepository.find({ order: { 'createdAt': 'DESC' } })
    }

    async findOneByEmailOrPhone(identifier: string): Promise<any> {
        return await this.teamsRepository.createQueryBuilder('youth').where('youth.email=:identifier OR youth.phone=:identifier', { identifier }).getOne()
    }

}
