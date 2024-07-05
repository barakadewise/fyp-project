import { Module } from '@nestjs/common';
import { ProjectResolver } from './resolver/project.resolver';
import { ProjectService } from './service/project.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entity/project.entity';
import { Partner } from 'src/partners/entity/partner.entity';
import { Installment } from 'src/installments/entities/installment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Partner, Installment])],
  providers: [ProjectResolver, ProjectService],
})
export class ProjectModule {}
