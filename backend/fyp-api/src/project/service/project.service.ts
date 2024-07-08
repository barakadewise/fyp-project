import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entity/project.entity';
import { ProjectDto } from '../dto/project-input-dto';
import { Partner } from 'src/partners/entity/partner.entity';
import { ResponseDto } from 'shared/response-dto';
import { MesssageEnum } from 'shared/message-enum';
import { UpdateProjectDto } from '../dto/update-project-dto';
import { Installment } from 'src/installments/entities/installment.entity';
import { ProjectData } from '../dto/projectData-dto';


@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Partner)
    private readonly partnerRepository: Repository<Partner>,
    @InjectRepository(Installment)
    private readonly installmentRepository: Repository<Installment>,
  ) {}

  async createProject(
    createProjectInput: ProjectDto,
    partner?: string,
  ): Promise<Project> {
    const newProject = this.projectRepository.create({ ...createProjectInput });
    if (createProjectInput.funded) {
      const partnerData = await this.partnerRepository.findOne({
        where: { name: partner },
      });
      if (partnerData) {
        newProject.partnerId = partnerData.id;
        newProject.partnerName = partner;
        return await this.projectRepository.save(newProject);
      }
      throw new BadRequestException('Invalid partner details');
    }
    return await this.projectRepository.save(newProject);
  }

  async findAll(): Promise<Project[]> {
    return await this.projectRepository.find({ order: { createdAt: 'DESC' } });
  }
  async removeProject(id: number): Promise<ResponseDto> {
    const project = await this.projectRepository.findOne({ where: { id: id } });
    if (project) {
      await this.projectRepository.delete(id);
      return {
        message: MesssageEnum.DELETE,
        statusCode: HttpStatus.OK,
      };
    }
    throw new NotFoundException('Project Not found!');
  }

  async getPartnersProjects(context: any) {
    return await this.projectRepository.find({
      where: { partnerId: context.req.user.sub },
    });
  }
  async upadateProjectStatus(
    projectId: number,
    updateProjectDto: UpdateProjectDto,
  ): Promise<ResponseDto> {
    const project = await this.projectRepository.exists({
      where: { id: projectId },
    });
    if (!project) throw new NotFoundException('Project Not Found!..');

  

    //update the project if found!
    await this.projectRepository.update(projectId, { ...updateProjectDto });
    return {
      message: MesssageEnum.UPDATE,
      statusCode: HttpStatus.OK,
    };
  }

  //function to generate ProjectData
  async getProjectReportData(id: number): Promise<ProjectData> {
    const project = await this.projectRepository.findOne({ where: { id: id } });
    if (!project) throw new BadRequestException('Project Not Not Found!.');

    const installments: Installment[] = [];

    const projectInstallments = await this.installmentRepository.find({
      where: { projectName: project.name },
    });
    projectInstallments.map((data) => {
      installments.push({...data});
    });
    console.log({ project, installments });
    return {
      projectName: project.name,
      ProjectDiscription: project.discription,
      projectDuration: project.duration,
      projectCost: project.cost,
      projectStatus: project.status,
      projectPartner: project.partnerName,
      installments: installments,
    };
  }
}
