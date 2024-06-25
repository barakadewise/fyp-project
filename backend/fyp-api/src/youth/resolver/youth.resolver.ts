import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { YouthService } from '../service/youth.service';
import { Youth } from '../entity/youth.entity';
import { YouthDto } from '../dto/youth-input-dto';
import { DeleteResult } from 'typeorm';
import { OperationDto } from 'dto/operation-dto';
import { ARRAY_CONTAINS } from 'class-validator';
import { ResponseDto } from 'shared/response-dto';
import { UpdateYouthDto } from '../dto/update-youth-dto';

@Resolver()
export class YouthResolver {
  constructor(private readonly youthServce: YouthService) {}

  @Mutation((_returns) => Youth)
  async createYouth(
    @Args('createYouthInput') createYoutDto: YouthDto,
    @Args('accountId') accountId: number,
  ) {
    return await this.youthServce.createYouth(createYoutDto, accountId);
  }

  @Query((_returns) => [Youth])
  async findAllYouth(): Promise<Youth[]> {
    return await this.youthServce.findAllYouth();
  }

  @Mutation(() => OperationDto)
  async deleteYouthById(@Args('id') id: number): Promise<OperationDto> {
    return await this.youthServce.deleteYouthById(id);
  }

  @Mutation((_returns) => ResponseDto)
  async updateYouth(
    @Args('updateYouthDto') updateYouthDto: UpdateYouthDto,
    @Args('youthId') youthId: number,
  ) {
    return await this.youthServce.updateYouth(updateYouthDto, youthId);
  }
}
