import { InputType, PartialType } from '@nestjs/graphql';
import { TeamsDto } from './team-input-dto';

@InputType()
export class UpdateTeamDto extends PartialType(TeamsDto) {}
