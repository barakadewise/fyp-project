import { Module } from '@nestjs/common';
import { TeamsResolver } from './resolver/teams.resolver';
import { TeamsService } from './service/teams.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teams } from './entity/team.entity';
import { Account } from 'src/accounts/entities/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Teams, Account])],
  providers: [TeamsResolver, TeamsService],
  exports: [TeamsService],
})
export class TeamsModule {}
