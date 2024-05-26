import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Project } from '../entity/project.entity';
import { ProjectService } from '../service/project.service';
import { ProjectDto } from '../dto/project-input-dto';
import { ResponseDto } from 'shared/response-dto';

@Resolver()
export class ProjectResolver {
    constructor(private readonly projectService: ProjectService) { }


    @Mutation(() => Project)
    async createProject(@Args('createProjectInput') createProjectInput: ProjectDto, @Args('partner', { nullable: true }) partner?: string) {
        return await this.projectService.createProject(createProjectInput, partner)

    }

    @Query(_returns => [Project])
    async findAllProjects(): Promise<Project[]> {
        return await this.projectService.findAll()
    }

    @Mutation(() => ResponseDto)
    async removeProject(@Args('id') id: number) {
        return await this.projectService.removeProject(id)
    }
}
