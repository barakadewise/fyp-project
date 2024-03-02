import { Module } from '@nestjs/common';
import { TeamsResolver } from './resolver/teams.resolver';
import { TeamsService } from './service/teams.service';

@Module({
  providers: [TeamsResolver, TeamsService]
})
export class TeamsModule {}
