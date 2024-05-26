import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entity/project.entity';
import { ProjectDto } from '../dto/project-input-dto';
import { Partner } from 'src/partners/entity/partner.entity';

@Injectable()
export class ProjectService {
    constructor(
        @InjectRepository(Project) private readonly projectRepository: Repository<Project>,
        @InjectRepository(Partner) private readonly partnerRepository: Repository<Partner>
    ) { }

    async createProject(createProjectInput: ProjectDto, partner?: string): Promise<Project> {
        const newProject = this.projectRepository.create({ ...createProjectInput });
        if (createProjectInput.funded) {
            const partnerData = await this.partnerRepository.findOne({ where: { name: partner } })
            if (partnerData) {
                newProject.partnerId = partnerData.id
                newProject.partnerName = partner
                return await this.projectRepository.save(newProject)
            }
            throw new BadRequestException("Invalid partner details")
        }
        return await this.projectRepository.save(newProject)

    }

    async findAll(): Promise<Project[]> {
        return await this.projectRepository.find({ order: { 'createdAt': 'DESC' } })
    }

}
