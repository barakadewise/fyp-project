import { Injectable, BadRequestException, HttpStatus, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { CreateAccountInput } from "../dto/create-account.input"
import { UpdateAccountInput } from "../dto/update-account.input"
import { Account } from "../entities/account.entity"
import * as bcrypt from 'bcrypt'
import { ResponseDto } from "shared/response-dto"

@Injectable()
export class AccountsService {
  constructor(@InjectRepository(Account) private readonly accountsRepository: Repository<Account>) { }
  async createAccount(createAccountInput: CreateAccountInput) {
    const account = await this.accountsRepository.findOne({ where: { email: createAccountInput.email } })
    if (!account) {
      const hashpassword = await bcrypt.hash(createAccountInput.password, 10)
      const newAccount = this.accountsRepository.create({ ...createAccountInput })
      newAccount.password = hashpassword
      return await this.accountsRepository.save(newAccount)
    }
    throw new BadRequestException('Email already taken')

  }

  async createMemberAccount(createAccountInput: CreateAccountInput) {
    const account = await this.accountsRepository.findOne({ where: { email: createAccountInput.email } })
    if (!account) {
      const newAccount = this.accountsRepository.create({ ...createAccountInput })
      const hashpawword = await bcrypt.hash(createAccountInput.password, 10)
      newAccount.password = hashpawword
      return await this.accountsRepository.save(newAccount)
    }
    throw new BadRequestException('Email alredy taken')

  }

  async findAllAccount() {
    return await this.accountsRepository.find({ order: { createdAt: 'DESC' } })
  }

  async updateAccount(updateAccountInput: UpdateAccountInput): Promise<ResponseDto> {
    const account = await this.accountsRepository.findOne({ where: { email: updateAccountInput.email } })
    if (account) {
      account.password = updateAccountInput.password
      await this.accountsRepository.save(account)
      return {
        message: "Password successfully Updated",
        statusCode: HttpStatus.OK
      }
    }
    throw new NotFoundException('Account Not Found')
  }

  async findOneByEmail(email: string) {
    return await this.accountsRepository.findOne({ where: { email: email } })
  }

  async updateLoginDate(email: string) {
    const account = await this.accountsRepository.findOne({ where: { email: email } })
    account.lastlogin = new Date
    await this.accountsRepository.save(account)
  }


}
