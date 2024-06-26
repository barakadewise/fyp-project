import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Training } from '../entities/training.entity';
import { CreateTrainingInput } from '../dto/create-training.input';
import { UpdateTrainingInput } from '../dto/update-training.input';
import { TrainingService } from '../services/training.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guard/gql-auth.guard';
import { CurrentUser } from 'decorators/current-user-decorator';
import { ResponseDto } from 'shared/response-dto';

@UseGuards(GqlAuthGuard)
@Resolver(() => Training)
export class TrainingResolver {
  constructor(private readonly trainingService: TrainingService) {}

  @Mutation(() => Training)
  async createTraining(
    @Args('createTrainingInput') createTrainingInput: CreateTrainingInput,
    @CurrentUser() user: any,
  ) {
    return await this.trainingService.create(createTrainingInput, user);
  }

  @Query(() => [Training])
  async findAllTraining() {
    return await this.trainingService.findAllTraining();
  }

  @Query(() => Training)
  async findOneTraining(@Args('id') id: number) {
    return this.trainingService.findOneTraining(id);
  }

  @Mutation(() => ResponseDto)
  async updateTraining(
    @Args('updateTrainingInput') updateTrainingInput: UpdateTrainingInput,
    @Args('id') id: number,
  ) {
    return this.trainingService.update(id, updateTrainingInput);
  }

  @Mutation(() => ResponseDto)
  async removeTraining(@Args('id') id: number) {
    return await this.trainingService.removeTriaining(id);
  }

  @Query(() => [Training])
  async getTeamsTraining(@CurrentUser() user: any) {
    const userId = user.sub;
    return await this.trainingService.getTeamsTraining(userId);
  }
}
