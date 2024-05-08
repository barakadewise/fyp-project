import { Injectable } from '@nestjs/common';
import { Teams } from '../entity/team.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TeamsDto } from '../dto/team-input-dto';
import * as bcript from 'bcrypt'

@Injectable()
export class TeamsService {
    constructor(@InjectRepository(Teams) private readonly teamsRepository: Repository<Teams>) { }

    //create teams function
    async createTeam(createTeamInput: TeamsDto): Promise<Teams> {
      
        const newTeam = this.teamsRepository.create({...createTeamInput})
        console.log(newTeam)
        return await this.teamsRepository.save(newTeam);
    }

    //function to query for all teams 
    async findAllTeams(): Promise<Teams[]> {
        return await this.teamsRepository.find({ order: { 'createdAt': 'DESC' } })
    }

    //function to find the teams by email or phone
    async findOneByEmailOrPhone(identifier: string): Promise<any> {
        return await this.teamsRepository.createQueryBuilder('youth').where('youth.email=:identifier OR youth.phone=:identifier', { identifier }).getOne()
    }

}
