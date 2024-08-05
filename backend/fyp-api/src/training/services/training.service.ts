import {
  BadRequestException,
  HttpStatus,
  Injectable,
  Logger,
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
import { TrainingApplicationDto } from '../dto/training-application.input';
import { Youth } from 'src/youth/entity/youth.entity';
import { TrainingParticipants } from '../entities/training-participants';

@Injectable()
export class TrainingService {
  private readonly loggerService = new Logger()
  constructor(
    @InjectRepository(Training)
    private readonly trainingRepository: Repository<Training>,
    @InjectRepository(Teams) private readonly teamRepository: Repository<Teams>,
    @InjectRepository(Youth) private readonly youthRespository: Repository<Youth>,
    @InjectRepository(TrainingParticipants) private readonly trainingParticipantsRespository: Repository<TrainingParticipants>,
  ) {
    this.loggerService.debug("Running Training serveices...")
  }



  async create(createTrainingInput: CreateTrainingInput, user: any) {
    const training = await this.trainingRepository.exists({
      where: { session: createTrainingInput.session },
    });

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

  async update(
    id: number,
    updateTrainingInput: UpdateTrainingInput,
  ): Promise<ResponseDto> {
    const trainig = await this.trainingRepository.findOne({
      where: { id: id },
    });
    if (!trainig) throw new BadRequestException('Training Not Found!.');
    //update if exist
    await this.trainingRepository.update(id, { ...updateTrainingInput });
    return {
      message: MesssageEnum.UPDATE,
      statusCode: HttpStatus.OK,
    };
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
    });
    if (!team) throw new BadRequestException('User Not found');
    return await this.trainingRepository.find({ where: { teamsId: team.id } });
  }

  async trainingApplication(input: TrainingApplicationDto, userId: number) {
    const training = await this.trainingRepository.findOne({ where: { id: input.trainingId } })
    const youth = await this.youthRespository.findOne({ where: { accountId: userId } })
    const newAplication = this.trainingParticipantsRespository.create({ ...input })

    try {

      if (!training) throw new NotFoundException("Training Not found!");
      if (!youth) throw new NotFoundException("Youth not found");

      //check if the apllication already exist 
      const exist = await this.trainingParticipantsRespository.findOne({ where: { youthId: youth.id } })
      if (exist) throw new BadRequestException("You can only Apply Once for Session!")

      //update and save
      newAplication.trainingId = training.id
      newAplication.trainingName = training.session
      newAplication.youthId = youth.id
      newAplication.youthName = `${youth.fname + ' ' + youth.lname}`

      return await this.trainingParticipantsRespository.save(newAplication)

    } catch (err) {
      this.loggerService.error(err)
      throw err
    }

  }

  async fetchAllTrainingAplications() {
    return await this.trainingParticipantsRespository.find()
  }

  async getCurrentYouthApplication(userId: number) {
    const youth = await this.youthRespository.findOne({ where: { accountId: userId } })
    if (!youth) throw new NotFoundException("Youth not found")
    return await this.trainingParticipantsRespository.find({ where: { youthId: youth.id } })

  }

  async deleteTrainingParticipant(id: number): Promise<ResponseDto> {
    const trainingParticipant = await this.trainingParticipantsRespository.findOne({ where: { id: id } })
    if (!trainingParticipant) throw new NotFoundException("Participant Not found")
    await this.trainingParticipantsRespository.remove(trainingParticipant)
    return {
      message: MesssageEnum.DELETE,
      statusCode: HttpStatus.OK
    }
  }

  async confirmTrainingApplicants(id: number): Promise<ResponseDto> {
    const aplicant = await this.trainingParticipantsRespository.findOne({ where: { id: id } })
    if (!aplicant) throw new NotFoundException("Aplicant Not found!")
    aplicant.isAproved = true
    await this.trainingParticipantsRespository.save(aplicant)

    return {
      message: "Aplicant Confirmed",
      statusCode: HttpStatus.OK
    }
  }

  async cancelTrainingConfirmation(id: number): Promise<ResponseDto> {
    const aplicant = await this.trainingParticipantsRespository.findOne({ where: { id: id } })
    if (!aplicant) throw new NotFoundException("Aplicant Not found!")
    aplicant.isAproved = false
    await this.trainingParticipantsRespository.save(aplicant)
    return {
      message: "Aplication Canceled",
      statusCode: HttpStatus.OK
    }

  }
}
