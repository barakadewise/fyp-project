import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Staff } from '../entity/staff-entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StaffInputDto } from '../dto/ceate-straff-input';
import { Account } from 'src/accounts/entities/account.entity';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async createStaff(createStaffInput: StaffInputDto, accountId: number) {
    const account = await this.accountRepository.findOne({
      where: { id: accountId },
    });
    if (account) {
      const newstaff = this.staffRepository.create({ ...createStaffInput });
      newstaff.email = account.email;
      newstaff.accountId = accountId;
      return await this.staffRepository.save(newstaff);
    }
    throw new BadRequestException('User account is invalid!');
  }

  async findAll() {
    return await this.staffRepository.find();
  }

  async findOne(id: number) {
    const staff = await this.staffRepository.findOne({ where: { id: id } });
    if (staff) {
      return staff;
    }
    throw new NotFoundException('Staff Not found');
  }
}
