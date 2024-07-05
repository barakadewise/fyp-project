import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Account } from '../entities/account.entity';
import { CreateAccountInput } from '../dto/create-account.input';
import { AccountsService } from '../service/accounts.service';
import { ResponseDto } from 'shared/response-dto';

@Resolver(() => Account)
export class AccountsResolver {
  constructor(private readonly accountsService: AccountsService) {}
  @Mutation(() => Account)
  async createAccount(
    @Args('createAccountInput') createAccountInput: CreateAccountInput,
  ) {
    return await this.accountsService.createAccount(createAccountInput);
  }

  @Mutation(() => ResponseDto)
  async removeAccount(@Args('accountId') accountId: number) {
    return await this.accountsService.removeAccount(accountId);
  }

  @Query(() => [Account])
  async findAllAccount() {
    return await this.accountsService.findAllAccount();
  }

  @Query(() => [Account])
  async curentlyCreatedUser() {
    return await this.accountsService.getRecentlyCreated();
  }
}
