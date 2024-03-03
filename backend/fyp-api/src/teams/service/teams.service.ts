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
        const hashedPssword = await bcript.hash(createTeamInput.password, 10)
        const newTeam = this.teamsRepository.create({
            name: createTeamInput.name,
            location: createTeamInput.location,
            address: createTeamInput.address,
            email:createTeamInput.email,
            password: hashedPssword
        })
        console.log(newTeam)
        return await this.teamsRepository.save(newTeam);
    }

    //function to query for all teams 
    async findAll(): Promise<Teams[]> {
        return await this.teamsRepository.find({ order: { 'createdAt': 'DESC' } })
    }
}
