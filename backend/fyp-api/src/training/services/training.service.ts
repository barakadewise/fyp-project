import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrainingInput } from '../dto/create-training.input';
import { UpdateTrainingInput } from '../dto/update-training.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Training } from '../entities/training.entity';
import { ResponseDto } from 'shared/response-dto';
import { MesssageEnum } from 'shared/message-enum';
import { Teams } from 'src/teams/entity/team.entity';

@Injectable()
export class TrainingService {
  constructor(
    @InjectRepository(Training)
    private readonly trainingRepository: Repository<Training>,
    @InjectRepository(Teams) private readonly teamRepository: Repository<Teams>,
  ) { }
  async create(createTrainingInput: CreateTrainingInput, user: any) {
    const training = await this.trainingRepository.exists({
      where: { session: createTrainingInput.session },
    });

    //check training session existance
    if (training)
      throw new BadRequestException('Training Program Session Already Exits!');
    const team = await this.teamRepository.findOne({
      where: { accountId: user.sub },
    });
    const newTraining = this.trainingRepository.create({
      ...createTrainingInput,
    });
    
   
    newTraining.teamsId = team.id;
    return await this.trainingRepository.save(newTraining);
  }

  // async exist(id: number): Promise<Boolean> {
  //   if (await this.trainingRepository.findOne({ where: { id: id } }))
  //     return true;
  //   return false;
  // }

  async findAllTraining() {
    return await this.trainingRepository.find();
  }

  async findOneTraining(id: number) {
    const training = await this.trainingRepository.findOne({
      where: { id: id },
    });
    if (!training)
      throw new NotFoundException('Training program  not Found!..');
    return training;
  }

  async update(id: number, updateTrainingInput: UpdateTrainingInput): Promise<ResponseDto> {
    const trainig = await this.trainingRepository.findOne({ where: { id: id } })
    if (!trainig) throw new BadRequestException("Training Not Found!.")
    //update if exist
    await this.trainingRepository.update(id, { ...updateTrainingInput })
    return {
      message: MesssageEnum.UPDATE,
      statusCode: HttpStatus.OK
    }
  }

  async removeTriaining(id: number): Promise<ResponseDto> {
    const training = await this.trainingRepository.findOne({
      where: { id: id },
    });
    if (!training)
      throw new NotFoundException('Training  Session Not Found...');
    await this.trainingRepository.remove(training);
    return {
      message: MesssageEnum.DELETE,
      statusCode: HttpStatus.OK,
    };
  }

  async getTeamsTraining(id: number) {
    const team = await this.teamRepository.findOne({
      where: { accountId: id },
    }); //check if the userId exists in teams table
    if (!team) throw new BadRequestException('User Not found');

    //if found retreve the teams Id and use it to query for the training sessions
    return await this.trainingRepository.find({ where: { teamsId: team.id } });
  }
}
