import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { Teams } from '../entity/team.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TeamsDto } from '../dto/team-input-dto';
import { Account } from 'src/accounts/entities/account.entity';
import { UpdateTeamDto } from '../dto/update-team-dto';
import { ResponseDto } from 'shared/response-dto';

import { MesssageEnum } from 'shared/message-enum';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Teams)
    private readonly teamsRepository: Repository<Teams>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async createTeam(createTeamInput: TeamsDto, accountId: number) {
    const account = await this.accountRepository.findOne({
      where: { id: accountId },
    });
    if (account) {
      const newTeam = this.teamsRepository.create({ ...createTeamInput });
      (newTeam.accountId = accountId), (newTeam.email = account.email);
      return await this.teamsRepository.save(newTeam);
    }
    throw new BadRequestException('Invalid user account');
  }
  async removeTeam(teamId: number): Promise<ResponseDto> {
    const team = await this.teamsRepository.findOne({ where: { id: teamId } });
    if (team) {
      await this.teamsRepository.delete(teamId);
      return {
        message: MesssageEnum.DELETE,
        statusCode: HttpStatus.OK,
      };
    }
    throw new BadRequestException('Failed to  delete! User Not Found!');
  }

  async findAllTeams(): Promise<Teams[]> {
    return await this.teamsRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOneByEmailOrPhone(identifier: string): Promise<any> {
    return await this.teamsRepository
      .createQueryBuilder('youth')
      .where('youth.email=:identifier OR youth.phone=:identifier', {
        identifier,
      })
      .getOne();
  }

  async updateTeam(
    updateTeamDto: UpdateTeamDto,
    teamId: number,
  ): Promise<ResponseDto> {
    const youth = await this.teamsRepository.findOne({ where: { id: teamId } });
    if (youth) {
      await this.teamsRepository.update(teamId, { ...updateTeamDto });
      return {
        message: MesssageEnum.UPDATE,
        statusCode: HttpStatus.OK,
      };
    }
    throw new BadRequestException(
      'Failed to update corresponding user Not Found',
    );
  }
}
