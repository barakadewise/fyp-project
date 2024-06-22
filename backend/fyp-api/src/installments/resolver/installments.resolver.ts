import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { CreateInstallmentInput } from '../dto/create-installment.input';
import { UpdateInstallmentInput } from '../dto/update-installment.input';
import { Installment } from '../entities/installment.entity';
import { InstallmentsService } from '../services/installments.service';
import { ResponseDto } from 'shared/response-dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guard/gql-auth.guard';
import { CurrentUser } from 'decorators/current-user-decorator';



@UseGuards(GqlAuthGuard)
@Resolver(() => Installment)
export class InstallmentsResolver {
  constructor(private readonly installmentsService: InstallmentsService) { }

  @Mutation(() => Installment)
  async createInstallment(@Args('createInstallmentInput') createInstallmentInput: CreateInstallmentInput, @Args('projectId') projectId: number, @CurrentUser()user:any) {
    return this.installmentsService.create(createInstallmentInput, projectId, user);
  }

  @Query(() => [Installment])
  async findAllInstallments() {
    return this.installmentsService.findAllInstallments();
  }

  @Query(() => Installment,)
  async findOneInsatallment(@Args('id') id: number) {
    return this.installmentsService.findOneInstallment(id);
  }

  @Mutation(() => ResponseDto)
  async updateInstallment(@Args('updateInstallmentInput') updateInstallmentInput: UpdateInstallmentInput, @Args('InstallmentId') InstallmentId: number): Promise<ResponseDto> {
    return await this.installmentsService.updateInstallments(InstallmentId, updateInstallmentInput)
  }

  @Mutation(() => Installment)
  async removeInstallment(@Args('id') id: number) {
    return this.installmentsService.removeInstallment(id);
  }

  @Query(() => [Installment])
  async partnerInstallments(@CurrentUser() user: any) {
    return await this.installmentsService.partnerInstallments(user.sub)
  }

}
