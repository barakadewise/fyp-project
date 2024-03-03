import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Project } from '../entity/project.entity';
import { ProjectService } from '../service/project.service';
import { ProjectDto } from '../dto/project-input-dto';

@Resolver()
export class ProjectResolver {
    constructor(private readonly projectService: ProjectService) { }

    //create opportunity mutation 
    @Mutation(() => Project)
    async createProject(@Args('createProjectInput') createProjectInput: ProjectDto): Promise<Project> {
        return await this.projectService.createProject(createProjectInput)

    }

    //Query all opportunities
    @Query(_returns => [Project])
    async findAllProjects(): Promise<Project[]> {
        return await this.projectService.findAll()
    }

}
