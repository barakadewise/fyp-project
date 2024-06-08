import { Module } from '@nestjs/common';
import { InstallmentsResolver } from './resolver/installments.resolver';
import { InstallmentsService } from './services/installments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from 'src/project/entity/project.entity';
import { Installment } from './entities/installment.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Project, Installment])],
  providers: [InstallmentsResolver, InstallmentsService],
})
export class InstallmentsModule { }
