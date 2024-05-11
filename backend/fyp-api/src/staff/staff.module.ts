import { Module } from '@nestjs/common';
import { StaffService } from './service/staff.service';
import { StaffResolver } from './resolver/staff.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Staff } from './entity/staff-entity';
import { Account } from 'src/accounts/entities/account.entity';

@Module({
  imports: [(
    TypeOrmModule.forFeature([Staff, Account])
  )],
  providers: [StaffResolver, StaffService],
})
export class StaffModule { }
