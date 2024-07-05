import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Project } from '../entity/project.entity';
import { ProjectService } from '../service/project.service';
import { ProjectDto } from '../dto/project-input-dto';
import { ResponseDto } from 'shared/response-dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guard/gql-auth.guard';
import { UpdateProjectDto } from '../dto/update-project-dto';
import { query } from 'express';
import { ProjectData } from '../dto/projectData-dto';

@Resolver()
export class ProjectResolver {
  constructor(private readonly projectService: ProjectService) {}

  @Mutation(() => Project)
  async createProject(
    @Args('createProjectInput') createProjectInput: ProjectDto,
    @Args('partner', { nullable: true }) partner?: string,
  ) {
    return await this.projectService.createProject(createProjectInput, partner);
  }

  @Query((_returns) => [Project])
  async findAllProjects(): Promise<Project[]> {
    return await this.projectService.findAll();
  }

  @Mutation(() => ResponseDto)
  async removeProject(@Args('id') id: number) {
    return await this.projectService.removeProject(id);
  }
  @UseGuards(GqlAuthGuard)
  @Query(() => [Project])
  async partnerProjects(@Context() context: any) {
    return await this.projectService.getPartnersProjects(context);
  }

  @Mutation(() => ResponseDto)
  async updateProject(
    @Args('projectId') projectId: number,
    @Args('updateProjectDto') updateProjectDto: UpdateProjectDto,
  ) {
    return await this.projectService.upadateProjectStatus(
      projectId,
      updateProjectDto,
    );
  }

  @Mutation(() => ProjectData)
  async getProjectReportData(@Args('projectId') projectId: number) {
    return await this.projectService.getProjectReportData(projectId);
  }
}
