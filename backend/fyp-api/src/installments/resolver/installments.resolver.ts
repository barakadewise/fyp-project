import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CreateInstallmentInput } from '../dto/create-installment.input';
import { UpdateInstallmentInput } from '../dto/update-installment.input';
import { Installment } from '../entities/installment.entity';
import { InstallmentsService } from '../services/installments.service';
import { ResponseDto } from 'shared/response-dto';


@Resolver(() => Installment)
export class InstallmentsResolver {
  constructor(private readonly installmentsService: InstallmentsService) {}

  @Mutation(() => Installment)
 async  createInstallment(@Args('createInstallmentInput') createInstallmentInput: CreateInstallmentInput, @Args('projectId')projectId:number) {
    return this.installmentsService.create(createInstallmentInput,projectId);
  }

  @Query(() => [Installment])
  async findAllInstallments() {
    return this.installmentsService.findAllInstallments();
  }

  @Query(() => Installment,)
 async  findOneInsatallment(@Args('id') id: number) {
    return this.installmentsService.findOneInstallment(id);
  }

  @Mutation(() => Installment)
  async updateInstallment(@Args('updateInstallmentInput') updateInstallmentInput: UpdateInstallmentInput):Promise<ResponseDto> {
    return await this.installmentsService.updateInstallment(updateInstallmentInput.installmentId,updateInstallmentInput)
  }

  @Mutation(() => Installment)
  async removeInstallment(@Args('id') id: number) {
    return this.installmentsService.removeInstallment(id);
  }
}
