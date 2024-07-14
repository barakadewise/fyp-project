import { Module } from '@nestjs/common';
import { TrainingResolver } from './resolvers/training.resolver';
import { TrainingService } from './services/training.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Training } from './entities/training.entity';
import { Teams } from 'src/teams/entity/team.entity';
import { TrainingParticipants } from './entities/training-participants';
import { Youth } from 'src/youth/entity/youth.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Training, Teams,TrainingParticipants,Youth])],
  providers: [TrainingResolver, TrainingService],
})
export class TrainingModule {}
