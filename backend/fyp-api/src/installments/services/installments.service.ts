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
import { Roles } from 'shared/roles-enum';
import { Partner } from 'src/partners/entity/partner.entity';



@Injectable()
export class InstallmentsService {
  constructor(
    @InjectRepository(Partner) private readonly partnerRepository: Repository<Partner>,
    @InjectRepository(Project) private readonly projectRepository: Repository<Project>,
    @InjectRepository(Installment) private readonly installmentsRepository: Repository<Installment>) { }


  async create(createInstallmentInput: CreateInstallmentInput, projectId: number, context: any) {
    const user = context.req.user;
    const project = await this.projectRepository.findOne({ where: { id: projectId } });

    if (!project) {
      throw new BadRequestException("Invalid Request: Project not found");
    }
    const newInstallment = this.installmentsRepository.create({ ...createInstallmentInput });
    const partnerId = createInstallmentInput.partnerId || (user.role === Roles.PARTNER ? user.id : null);

    if (!partnerId) {
      throw new BadRequestException("Partner id required!");
    }

    const partner = await this.partnerRepository.findOne({ where: { id: partnerId } });

    if (!partner) {
      throw new BadRequestException("Invalid Request: Partner not found");
    }
    
    newInstallment.projectName = project.name;
    newInstallment.projectCost = project.cost;
    newInstallment.remainAmount=project.cost
    newInstallment.partnerId = project.partnerId
    newInstallment.status = InstallmentsStatus.PENDING;

    project.partnerName = partner.name;
    project.partnerId = partner.id;
    project.funded = true;

    await this.projectRepository.save(project);
    return await this.installmentsRepository.save(newInstallment);
  }

  async findAllInstallments() {
    return await this.installmentsRepository.find()
  }

  async findOneInstallment(id: number) {
    const installment = await this.installmentsRepository.findOne({ where: { id: id } })
    if (!installment) throw new NotFoundException("Installment Not Found!");
    return installment


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

  async partnerInstallments(context: any) {
    const partner = await this.partnerRepository.findOne({ where: { accountId: context.req.user.sub } })
    if (!partner) {
      throw new BadRequestException("Invalid partner details account")
    }
    return await this.installmentsRepository.find({ where: { partnerId: partner.id } })

  }

  async updateInstallments(installmentId: number, updateInstallmentInput: UpdateInstallmentInput): Promise<ResponseDto> {
    const installment = await this.installmentsRepository.findOne({ where: { id: installmentId } })
    if (!installment) throw new NotFoundException("Installment Not Found!");

    //update the installement if exist
    // if(updateInstallmentInput.paid){
    //   installment.paid+=updateInstallmentInput.paid,
    //   installment.payment_Ref=updateInstallmentInput.payment_Ref
    //   installment.remainAmount-=(installment.paid+updateInstallmentInput.paid)
    // }
   
   
    if(updateInstallmentInput.paid){
    
  
      await this.installmentsRepository.update(installmentId, { ...updateInstallmentInput })
      return {
      message: MesssageEnum.UPDATE,
      statusCode: HttpStatus.OK
    }
    }
  
    await this.installmentsRepository.update(installmentId, { ...updateInstallmentInput })
    return {
      message: MesssageEnum.UPDATE,
      statusCode: HttpStatus.OK
    }

  }
}
