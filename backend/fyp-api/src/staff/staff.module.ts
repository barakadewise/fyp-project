import { Module } from '@nestjs/common';
import { StaffService } from './service/staff.service';
import { StaffResolver } from './resolver/staff.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Staff } from './entity/staff-entity';

@Module({
  imports:[(
    TypeOrmModule.forFeature([Staff])
  )],
  providers: [StaffResolver, StaffService],
})
export class StaffModule {}
