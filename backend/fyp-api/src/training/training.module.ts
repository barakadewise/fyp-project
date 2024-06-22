import { Module } from '@nestjs/common';
import { TrainingResolver } from './resolvers/training.resolver';
import { TrainingService } from './services/training.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Training } from './entities/training.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Training])],
  providers: [TrainingResolver, TrainingService],
})
export class TrainingModule { }
