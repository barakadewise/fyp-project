import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TeamsService } from '../service/teams.service';
import { Teams } from '../entity/team.entity';
import { TeamsDto } from '../dto/team-input-dto';


@Resolver()
export class TeamsResolver {
    constructor(private readonly teamsService: TeamsService) { }

    //mutation to craete teams 
    @Mutation(_returns => Teams)
    async createTeam(@Args('createTeamInput') createTeamInput: TeamsDto): Promise<Teams> {
        return await this.teamsService.createTeam(createTeamInput)
    }

    //query for all teams 
    @Query(_returns => [Teams])
    async findAllTeams(): Promise<Teams[]> {
        return await this.teamsService.findAllTeams()
    }

}
