import { Module } from '@nestjs/common';
import { AdminstrationlevelResolver } from './resolver/adminstrationlevel.resolver';
import { AdminstrationlevelService } from './service/adminstrationlevel.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdministrationLevel } from './entity/adminstration-leve.entity';

@Module({
  imports:[TypeOrmModule.forFeature([AdministrationLevel])],
  providers: [AdminstrationlevelResolver, AdminstrationlevelService]
})
export class AdminstrationlevelModule {}
