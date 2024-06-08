import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateInstallmentInput } from '../dto/create-installment.input';
import { UpdateInstallmentInput } from '../dto/update-installment.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Installment } from '../entities/installment.entity';
import { Repository } from 'typeorm';
import { Project } from 'src/project/entity/project.entity';
import { InstallmentsStatus } from '../enum/installment-status';
import { ResponseDto } from 'shared/response-dto';
import { MesssageEnum } from 'shared/message-enum';


@Injectable()
export class InstallmentsService {
  constructor(
    @InjectRepository(Project) private readonly projectRepository: Repository<Project>,
    @InjectRepository(Installment) private readonly installmentsRepository: Repository<Installment>) { }

  async create(createInstallmentInput: CreateInstallmentInput, projectId: number) {
    const project = await this.projectRepository.findOne({ where: { id: projectId } })
    if (project) {
      const newInstallment = this.installmentsRepository.create({ ...createInstallmentInput })
      newInstallment.projectName = project.name;
      newInstallment.projectCost = project.cost;
      newInstallment.status = InstallmentsStatus.PENDING
      return await this.installmentsRepository.save(newInstallment)

    }
    throw new BadRequestException("Invalid Request Project Not found")

  }

  async findAllInstallments() {
    return await this.installmentsRepository.find()
  }

  async findOneInstallment(id: number) {
    const installment = await this.installmentsRepository.findOne({ where: { id: id } })
    if (installment) {
      return installment
    }
    throw new NotFoundException("Installment Not Found!")
  }

  async updateInstallment(id: number, updateInstallmentInput: UpdateInstallmentInput): Promise<ResponseDto> {
    const installment = await this.installmentsRepository.findOne({ where: { id: id } })
    if (installment) {
      await this.installmentsRepository.update(id, { ...updateInstallmentInput })
      return {
        message: MesssageEnum.UPDATE,
        statusCode: HttpStatus.OK
      }

    }
    throw new BadRequestException("Invalid Installment Not Found")
  }

  async removeInstallment(id: number): Promise<ResponseDto> {
    const installment = await this.installmentsRepository.findOne({ where: { id: id } })
    if (installment) {
      await this.installmentsRepository.remove(installment)
      return {
        message: MesssageEnum.DELETE,
        statusCode: HttpStatus.OK
      }
    }
    throw new BadRequestException("Invalid Installment Not Found")

  }
}
