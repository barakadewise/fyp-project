import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Account } from '../entities/account.entity';
import { CreateAccountInput } from '../dto/create-account.input';
import { AccountsService } from '../service/accounts.service';

@Resolver(() => Account)
export class AccountsResolver {
  constructor(private readonly accountsService: AccountsService) { }
  @Mutation(() => Account)
  async crateAcccount(@Args('createAccountInput') createAccountInput: CreateAccountInput) {
    return await this.accountsService.createAccount(createAccountInput)

  }

}
