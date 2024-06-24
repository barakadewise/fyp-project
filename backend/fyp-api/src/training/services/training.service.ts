import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrainingInput } from '../dto/create-training.input';
import { UpdateTrainingInput } from '../dto/update-training.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Training } from '../entities/training.entity';
import { ResponseDto } from 'shared/response-dto';
import { MesssageEnum } from 'shared/message-enum';



@Injectable()
export class TrainingService {
  constructor(@InjectRepository(Training) private readonly trainingRepository: Repository<Training>) { }
  async create(createTrainingInput: CreateTrainingInput) {
    const training = await this.trainingRepository.exists({ where: { session: createTrainingInput.session } })

    //check training session existance 
    if (training) throw new BadRequestException("Training Program Session Already Exits!");

    const newTraining = this.trainingRepository.create({ ...createTrainingInput})
    return await this.trainingRepository.save(newTraining)

  }

  async exist(id: number): Promise<Boolean> {
    if (await this.trainingRepository.findOne({ where: { id: id } })) return true;
    return false;
  }

  async findAllTraining() {
    return await this.trainingRepository.find()
  }

  async findOneTraining(id: number) {
    const training = await this.trainingRepository.findOne({ where: { id: id } })
    if (!training) throw new NotFoundException("Training program  not Found!..");
    return training
  }

  async update(id: number, updateTrainingInput: UpdateTrainingInput) {
    return `This action updates a #${id} training`;
  }

  async removeTriaining(id: number): Promise<ResponseDto> {
    const training = await this.trainingRepository.findOne({ where: { id: id } })
    if (!training) throw new NotFoundException("Training Not Found...");
    await this.trainingRepository.remove(training)
    return {
      message: MesssageEnum.DELETE,
      statusCode: HttpStatus.OK
    }
  }
}
