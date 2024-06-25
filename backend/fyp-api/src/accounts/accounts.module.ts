import { Module } from '@nestjs/common';
import { AccountsResolver } from './resolver/accounts.resolver';
import { AccountsService } from './service/accounts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Account])],
  providers: [AccountsResolver, AccountsService],
  exports: [AccountsService],
})
export class AccountsModule {}
