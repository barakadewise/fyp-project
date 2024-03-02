import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entity/project.entity';
import { ProjectDto } from '../dto/project-input-dto';

@Injectable()
export class ProjectService {
    constructor(@InjectRepository(Project) private readonly projectRepository: Repository<Project>) { }

    //function to create project
    async createProject(createProjectInput: ProjectDto): Promise<Project> {
        const newProject = this.projectRepository.create(createProjectInput);
        return await this.projectRepository.save(newProject)

    }

    //Query all projects
    async findAll(): Promise<Project[]> {
        return await this.projectRepository.find({ order: { 'createdAt': 'DESC' } })
    }
}
