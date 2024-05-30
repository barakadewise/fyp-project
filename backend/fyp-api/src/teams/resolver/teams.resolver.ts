import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TeamsService } from '../service/teams.service';
import { Teams } from '../entity/team.entity';
import { TeamsDto } from '../dto/team-input-dto';
import { ResponseDto } from 'shared/response-dto';
import { UpdateTeamDto } from '../dto/update-team-dto';


@Resolver()
export class TeamsResolver {
    constructor(private readonly teamsService: TeamsService) { }

    @Mutation(_returns => Teams)
    async createTeam(@Args('createTeamInput') createTeamInput: TeamsDto, @Args('accountId') accountId: number) {
        return await this.teamsService.createTeam(createTeamInput, accountId)
    }

    @Query(_returns => [Teams])
    async findAllTeams() {
        return await this.teamsService.findAllTeams()
    }

    @Mutation(_returns => ResponseDto)
    async updateTeam(@Args('updateTeamDto') updateTeamDto: UpdateTeamDto, @Args('teamId') teamId: number) {
        return await this.teamsService.updateTeam(updateTeamDto, teamId)
    }
    
    @Mutation(_returns => ResponseDto)
    async removeTeam(@Args('teamId') teamId: number) {
        return await this.teamsService.removeTeam(teamId)
    }

}
