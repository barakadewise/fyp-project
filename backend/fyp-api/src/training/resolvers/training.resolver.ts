import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Training } from '../entities/training.entity';
import { CreateTrainingInput } from '../dto/create-training.input';
import { UpdateTrainingInput } from '../dto/update-training.input';
import { TrainingService } from '../services/training.service';

@Resolver(() => Training)
export class TrainingResolver {
  constructor(private readonly trainingService: TrainingService) { }

  @Mutation(() => Training)
  async createTraining(@Args('createTrainingInput') createTrainingInput: CreateTrainingInput) {
    return await this.trainingService.create(createTrainingInput);
  }

  @Query(() => [Training])
  async findAllTraining() {
    return await this.trainingService.findAllTraining();
  }

  @Query(() => Training)
  async findOneTraining(@Args('id') id: number) {
    return this.trainingService.findOneTraining(id);
  }

  @Mutation(() => Training)
  async updateTraining(@Args('updateTrainingInput') updateTrainingInput: UpdateTrainingInput) {
    return this.trainingService.update(updateTrainingInput.id, updateTrainingInput);
  }

  @Mutation(() => Training)
  async removeTraining(@Args('id') id: number) {
    return await this.trainingService.removeTriaining(id);
  }
}
