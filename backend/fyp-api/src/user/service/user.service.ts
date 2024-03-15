import { Injectable } from '@nestjs/common';
import { CreateUserInput } from '../dto/create-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from 'utils/roles-enums';


@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) { }

  //function to create youth
  async createYouth(createUserInput: CreateUserInput): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserInput.password, 10)

    const newYouth = this.userRepository.create({
      username: createUserInput.username,
      password: hashedPassword,
      role: Role.youth,
    })
    console.log(newYouth)
    return await this.userRepository.save(newYouth)
  }

  //function to create Partner
  async createPartner(createUserInput: CreateUserInput): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserInput.password, 10)
    const newPartner = this.userRepository.create({
      username: createUserInput.username,
      password: hashedPassword,
      role: Role.partner

    })
    return await this.userRepository.save(newPartner)
  }

  //function to create Tema
  async createTeam(createUserInput: CreateUserInput): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserInput.password, 10)
    const newTeam = this.userRepository.create({
      username: createUserInput.username,
      password: hashedPassword,
      role: Role.team
    })
    return await this.userRepository.save(newTeam)
  }
}
